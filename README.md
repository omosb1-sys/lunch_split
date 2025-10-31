점심을 위한 투표와 정산을 하는 애플리케이션 제작

🚀 주요 기능

🎲 랜덤 점심 메뉴 추천 – 메뉴 선택이 어려울 때 랜덤 추천

🗳️ 투표 기능 – 참여자들이 메뉴를 선택하고 투표

💰 비용 정산 기능 – 각자의 주문 금액 입력 후 자동 계산

👤 프로필 관리 – 사용자의 개인 정보 확인 및 관리

📂 프로젝트 구조
src/
├── pages/
│   ├── Home.jsx          // 메인 페이지 (랜덤추천 / 방 만들기)
│   ├── VoteRoom.jsx      // 투표 화면
│   ├── SplitBill.jsx     // 비용 정산 화면
│   └── Profile.jsx       // 내 정보 페이지
├── components/
│   ├── MenuCard.jsx      // 메뉴 카드 UI
│   ├── Button.jsx        // 버튼 컴포넌트
│   └── Modal.jsx         // 팝업 모달
└── App.jsx               // 라우팅 및 앱 엔트리

⚡ 설치 및 실행

저장소 클론

git clone https://github.com/username/lunch_split.git
cd lunch_split


의존성 설치

npm install


개발 서버 실행

npm start


브라우저에서 http://localhost:3000 접속

🤝 기여

버그 리포트, 기능 추가, 스타일 개선 등 모두 환영합니다.
Pull Request 시 CONTRIBUTING.md
 참고 부탁드립니다.

📝 라이선스

MIT License
