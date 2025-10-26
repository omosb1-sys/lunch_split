import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuCard } from "@/components/MenuCard";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Users, Copy, CheckCircle2, Soup, Beef, Salad, Sandwich, Pizza } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { VoteRoom, Vote } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";

function CreateRoom() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState("");
  const [menuOptions, setMenuOptions] = useState<string[]>(["김치찌개", "제육볶음", "비빔밥"]);
  const [newMenu, setNewMenu] = useState("");

  const createRoomMutation = useMutation({
    mutationFn: async (data: { name: string; menuOptions: string[] }) => {
      const response = await apiRequest("POST", "/api/vote-rooms", data);
      return await response.json() as VoteRoom;
    },
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["/api/vote-rooms"] });
      navigate(`/vote/${room.id}`);
      toast({
        title: "투표방 생성 완료!",
        description: "친구들에게 공유하세요",
      });
    },
  });

  const addMenu = () => {
    if (newMenu.trim() && !menuOptions.includes(newMenu.trim())) {
      setMenuOptions([...menuOptions, newMenu.trim()]);
      setNewMenu("");
    }
  };

  const removeMenu = (menu: string) => {
    setMenuOptions(menuOptions.filter((m) => m !== menu));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && menuOptions.length >= 2) {
      createRoomMutation.mutate({ name: roomName, menuOptions });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-create-room-title">
            새 투표방 만들기
          </h1>
          <p className="text-muted-foreground" data-testid="text-create-room-subtitle">
            메뉴를 추가하고 친구들과 투표하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room-name">투표방 이름</Label>
            <Input
              id="room-name"
              placeholder="예: 오늘 점심 뭐 먹을까?"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="h-12"
              data-testid="input-room-name"
            />
          </div>

          <div className="space-y-3">
            <Label>메뉴 선택 ({menuOptions.length}개)</Label>

            <div className="flex gap-2">
              <Input
                placeholder="메뉴 추가..."
                value={newMenu}
                onChange={(e) => setNewMenu(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMenu())}
                className="h-12"
                data-testid="input-new-menu"
              />
              <Button
                type="button"
                onClick={addMenu}
                size="icon"
                className="h-12 w-12"
                data-testid="button-add-menu"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {menuOptions.map((menu) => (
                <Badge
                  key={menu}
                  variant="secondary"
                  className="px-3 py-2 text-sm font-medium"
                  data-testid={`badge-menu-${menu}`}
                >
                  {menu}
                  <button
                    type="button"
                    onClick={() => removeMenu(menu)}
                    className="ml-2 hover:text-destructive"
                    data-testid={`button-remove-menu-${menu}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold rounded-xl"
            disabled={!roomName.trim() || menuOptions.length < 2 || createRoomMutation.isPending}
            data-testid="button-create-room"
          >
            {createRoomMutation.isPending ? "생성 중..." : "투표방 만들기"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function RoomView({ roomId }: { roomId: string }) {
  const { toast } = useToast();
  const [voterName, setVoterName] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const { data: room, isLoading: roomLoading } = useQuery<VoteRoom>({
    queryKey: ["/api/vote-rooms", roomId],
  });

  const { data: votes = [] } = useQuery<Vote[]>({
    queryKey: ["/api/votes", roomId],
    refetchInterval: 3000,
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { roomId: string; menuOption: string; voterName: string }) => {
      const response = await apiRequest("POST", "/api/votes", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/votes", roomId] });
      setHasVoted(true);
      toast({
        title: "투표 완료!",
        description: "친구들의 선택을 기다려보세요",
      });
    },
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "vote-update" && data.roomId === roomId) {
          queryClient.invalidateQueries({ queryKey: ["/api/votes", roomId] });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  const handleVote = (menuOption: string) => {
    if (!voterName.trim()) {
      toast({
        title: "이름을 입력하세요",
        description: "투표하려면 이름이 필요해요",
        variant: "destructive",
      });
      return;
    }
    voteMutation.mutate({ roomId, menuOption, voterName: voterName.trim() });
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "링크 복사 완료!",
      description: "친구들에게 공유하세요",
    });
  };

  if (roomLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">투표방 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">투표방을 찾을 수 없어요</p>
          <p className="text-muted-foreground">링크를 다시 확인해주세요</p>
        </div>
      </div>
    );
  }

  const voteCountsByMenu = votes.reduce((acc, vote) => {
    acc[vote.menuOption] = (acc[vote.menuOption] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = votes.length;

  const menuIcons: Record<string, LucideIcon> = {
    김치찌개: Soup,
    제육볶음: Beef,
    비빔밥: Soup,
    짜장면: Soup,
    햄버거: Sandwich,
    샐러드: Salad,
    돈까스: Pizza,
    김밥: Sandwich,
    라면: Soup,
    치킨: Pizza,
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-room-name">
                {room.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="w-4 h-4" />
                <span data-testid="text-participant-count">{totalVotes}명 참여 중</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyRoomLink}
              data-testid="button-copy-link"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {!hasVoted && (
          <div className="mb-6">
            <Label htmlFor="voter-name" className="mb-2 block">
              내 이름
            </Label>
            <Input
              id="voter-name"
              placeholder="이름을 입력하세요"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="h-12"
              data-testid="input-voter-name"
            />
          </div>
        )}

        <div className="space-y-4">
          {room.menuOptions.map((menu) => {
            const voteCount = voteCountsByMenu[menu] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const icon = menuIcons[menu] || Soup;

            return (
              <MenuCard
                key={menu}
                icon={icon}
                name={menu}
                voteCount={voteCount}
                votePercentage={percentage}
                onClick={() => !hasVoted && handleVote(menu)}
              >
                {!hasVoted && (
                  <Button
                    className="w-full h-12 rounded-xl font-medium"
                    disabled={voteMutation.isPending}
                    data-testid={`button-vote-${menu}`}
                  >
                    {voteMutation.isPending ? "투표 중..." : "이 메뉴 선택"}
                  </Button>
                )}
                {hasVoted && voteCount > 0 && (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">투표 완료</span>
                  </div>
                )}
              </MenuCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function VoteRoom() {
  const [match, params] = useRoute("/vote/:id");

  if (match && params?.id) {
    return <RoomView roomId={params.id} />;
  }

  return <CreateRoom />;
}
