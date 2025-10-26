import { Link, useLocation } from "wouter";
import { Utensils, Vote, Receipt } from "lucide-react";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-card-border">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between h-16">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3">
            <Utensils className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">점심메뉴</h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" data-testid="link-nav-home">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">추천</span>
            </div>
          </Link>

          <Link href="/vote" data-testid="link-nav-vote">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location.startsWith("/vote")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Vote className="w-4 h-4" />
              <span className="hidden sm:inline">투표</span>
            </div>
          </Link>

          <Link href="/split-bill" data-testid="link-nav-split">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === "/split-bill"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">정산</span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  );
}
