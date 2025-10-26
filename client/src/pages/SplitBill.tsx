import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users, Calculator } from "lucide-react";

interface Person {
  id: string;
  name: string;
  amount: number;
}

export default function SplitBill() {
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState("");

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonName.trim(),
        amount: 0,
      };
      setPeople([...people, newPerson]);
      setNewPersonName("");
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  const splitEvenly = () => {
    if (people.length > 0 && totalAmount) {
      const amount = parseInt(totalAmount);
      const perPerson = Math.floor(amount / people.length);
      const remainder = amount % people.length;

      const updatedPeople = people.map((person, index) => ({
        ...person,
        amount: index === 0 ? perPerson + remainder : perPerson,
      }));

      setPeople(updatedPeople);
    }
  };

  const split2to1 = () => {
    if (people.length >= 2 && totalAmount) {
      const amount = parseInt(totalAmount);
      const firstPerson = Math.floor(amount * 0.6667);
      const others = Math.floor((amount - firstPerson) / (people.length - 1));
      const remainder = amount - firstPerson - others * (people.length - 1);

      const updatedPeople = people.map((person, index) => ({
        ...person,
        amount: index === 0 ? firstPerson : index === 1 ? others + remainder : others,
      }));

      setPeople(updatedPeople);
    }
  };

  const customSplit = () => {
    if (people.length > 0 && totalAmount) {
      setPeople(
        people.map((person) => ({
          ...person,
          amount: 0,
        }))
      );
    }
  };

  const updatePersonAmount = (id: string, amount: string) => {
    const numAmount = parseInt(amount) || 0;
    setPeople(
      people.map((person) => (person.id === id ? { ...person, amount: numAmount } : person))
    );
  };

  const totalAssigned = people.reduce((sum, person) => sum + person.amount, 0);
  const remaining = totalAmount ? parseInt(totalAmount) - totalAssigned : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-split-bill-title">
            식사비 정산하기
          </h1>
          <p className="text-muted-foreground" data-testid="text-split-bill-subtitle">
            총 금액을 입력하고 인원별로 나눠보세요
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Label htmlFor="total-amount" className="mb-2 block">
              총 금액
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₩
              </span>
              <Input
                id="total-amount"
                type="number"
                placeholder="50000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="h-14 pl-8 text-right text-xl font-semibold"
                data-testid="input-total-amount"
              />
            </div>
          </Card>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              참여 인원 ({people.length}명)
            </Label>

            <div className="flex gap-2">
              <Input
                placeholder="이름 입력..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPerson())}
                className="h-12"
                data-testid="input-person-name"
              />
              <Button
                type="button"
                onClick={addPerson}
                size="icon"
                className="h-12 w-12"
                data-testid="button-add-person"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {people.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={splitEvenly}
                  disabled={!totalAmount}
                  className="h-12 font-medium"
                  data-testid="button-split-evenly"
                >
                  N빵
                </Button>
                <Button
                  variant="outline"
                  onClick={split2to1}
                  disabled={!totalAmount || people.length < 2}
                  className="h-12 font-medium"
                  data-testid="button-split-2to1"
                >
                  2:1로
                </Button>
                <Button
                  variant="outline"
                  onClick={customSplit}
                  disabled={!totalAmount}
                  className="h-12 font-medium"
                  data-testid="button-custom-split"
                >
                  직접 입력
                </Button>
              </div>

              <div className="space-y-3">
                {people.map((person) => (
                  <Card key={person.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium" data-testid={`text-person-name-${person.id}`}>
                            {person.name}
                          </span>
                          <button
                            onClick={() => removePerson(person.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            data-testid={`button-remove-person-${person.id}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            ₩
                          </span>
                          <Input
                            type="number"
                            value={person.amount || ""}
                            onChange={(e) => updatePersonAmount(person.id, e.target.value)}
                            className="h-12 pl-7 text-right font-semibold"
                            placeholder="0"
                            data-testid={`input-person-amount-${person.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {totalAmount && people.length > 0 && (
            <Card className="p-6 bg-primary text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  <span className="font-medium">정산 요약</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>총 금액</span>
                  <span className="font-semibold" data-testid="text-summary-total">
                    ₩{parseInt(totalAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>배분 완료</span>
                  <span className="font-semibold" data-testid="text-summary-assigned">
                    ₩{totalAssigned.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-primary-foreground/20">
                  <span>남은 금액</span>
                  <span
                    className={remaining !== 0 ? "text-yellow-300" : ""}
                    data-testid="text-summary-remaining"
                  >
                    ₩{remaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {remaining === 0 && (
                <Badge variant="secondary" className="w-full mt-4 justify-center py-2">
                  정산 완료!
                </Badge>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
