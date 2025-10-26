import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Vote, Receipt, Soup, Beef, Salad, Sandwich, Pizza, Coffee } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const menus: Array<{ name: string; icon: LucideIcon }> = [
  { name: "김치찌개", icon: Soup },
  { name: "제육볶음", icon: Beef },
  { name: "비빔밥", icon: Soup },
  { name: "짜장면", icon: Soup },
  { name: "햄버거", icon: Sandwich },
  { name: "샐러드", icon: Salad },
  { name: "돈까스", icon: Pizza },
  { name: "김밥", icon: Sandwich },
  { name: "라면", icon: Soup },
  { name: "치킨", icon: Pizza },
];

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState<{ name: string; icon: LucideIcon } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const pickMenu = () => {
    setIsAnimating(true);
    const random = menus[Math.floor(Math.random() * menus.length)];
    
    setTimeout(() => {
      setSelectedMenu(random);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Soup className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-title">
              오늘 점심 뭐 먹을래?
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-subtitle">
            메뉴 고민 끝! 랜덤 추천 받거나 친구들과 투표하세요
          </p>
        </div>

        <Button
          onClick={pickMenu}
          size="lg"
          className="w-full max-w-xs h-14 text-lg font-semibold rounded-xl mb-8"
          data-testid="button-pick-menu"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          메뉴 추천 받기
        </Button>

        {selectedMenu && (
          <div
            className={`w-full max-w-xs transition-all duration-300 ${
              isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="bg-card border border-card-border rounded-2xl p-8 mb-12">
              <p className="text-sm text-muted-foreground mb-4" data-testid="text-recommendation-label">
                오늘의 추천 메뉴
              </p>
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full">
                <selectedMenu.icon className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-recommended-menu">
                {selectedMenu.name}
              </h2>
            </div>
          </div>
        )}

        <div className="w-full max-w-xs space-y-3">
          <Link href="/vote" data-testid="link-vote-page">
            <Button variant="outline" className="w-full h-12 rounded-xl font-medium">
              <Vote className="w-5 h-5 mr-2" />
              친구들과 투표하기
            </Button>
          </Link>

          <Link href="/split-bill" data-testid="link-split-bill-page">
            <Button variant="outline" className="w-full h-12 rounded-xl font-medium">
              <Receipt className="w-5 h-5 mr-2" />
              식사비 나눠 계산하기
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-5 gap-3">
          {menus.map((menu) => (
            <div
              key={menu.name}
              className="w-12 h-12 flex items-center justify-center bg-card rounded-lg hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => setSelectedMenu(menu)}
              data-testid={`icon-${menu.name}`}
            >
              <menu.icon className="w-6 h-6 text-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
