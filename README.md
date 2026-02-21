# Business AI Team

마케팅, 재무, 법무, HR, 개발 등 **16개 AI 전문가 팀**과 함께하는 비즈니스 어시스턴트.

본인의 Anthropic API 키만 있으면 무료로 사용할 수 있으며, 대화 기록은 브라우저에만 저장됩니다.

**[→ 라이브 데모](https://business-ai-web-phi.vercel.app)**

---

## 주요 기능

- **자동 전문가 라우팅** — 메시지를 분석해 적합한 전문가 에이전트를 자동 선택
- **16개 전문 영역** — 마케팅, 리서치, 작문, HR, 재무, 법무, 영업, 데이터, 프로덕트, 개발, 디자인, 생산성, PR, 보안, 컴플라이언스, 사업개발
- **실시간 스트리밍** — 답변이 생성되는 즉시 화면에 표시
- **이미지 첨부** — 이미지를 업로드해 분석 요청 가능
- **대화 기록 관리** — 브라우저 로컬 스토리지에 저장, 자동 제목 생성
- **모바일 반응형** — 모든 화면 크기에서 사용 가능

## AI 전문가 팀

| 에이전트 | 페르소나 | 담당 업무 |
|---------|---------|---------|
| 마케팅 전문가 | Aria | 캠페인 기획, 콘텐츠 제작, 브랜드 전략 |
| 리서치 전문가 | Dana | 시장 조사, 경쟁사 분석, 트렌드 리서치 |
| 작문 전문가 | Mia | 이메일, 문서, 번역, 요약 |
| HR 전문가 | Grace | 채용, 성과 관리, 조직 문화 |
| 재무 전문가 | Victor | 재무 분석, 예산 수립, 투자 검토 |
| 법무 전문가 | Lucas | 계약 검토, 법률 자문, 리스크 식별 |
| 영업 전문가 | Ryan | 영업 전략, 파이프라인, 제안서 |
| 데이터 분석가 | Sofia | 데이터 분석, 통계, KPI 설계 |
| 프로덕트 매니저 | Kai | 제품 전략, 로드맵, 사용자 리서치 |
| 개발 전문가 | Noah | 기술 아키텍처, 코드 리뷰, 개발 전략 |
| 디자인 전문가 | Luna | UX/UI 설계, 브랜드 디자인, 사용성 |
| 생산성 전문가 | Max | 업무 관리, 일정 조율, 프로세스 최적화 |
| PR 전문가 | Ivy | 홍보 전략, 미디어 관계, 위기 커뮤니케이션 |
| 보안 전문가 | Rex | 정보 보안, 리스크 관리, 보안 정책 |
| 컴플라이언스 전문가 | Claire | 규정 준수, 내부 감사, 리스크 관리 |
| 사업개발 전문가 | Ethan | 파트너십, 신규 사업, M&A 검토 |

## 시작하기

### 사전 요건

- Node.js 18 이상
- [Anthropic API 키](https://console.anthropic.com) (`sk-ant-`로 시작)

### 설치 및 실행

```bash
git clone <repository-url>
cd business-ai-web
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 온보딩 화면이 나타납니다. Anthropic API 키를 입력하면 바로 사용할 수 있습니다.

### 환경 변수 (선택)

```bash
# 프로덕션 배포 시 OG 이미지 등에 사용
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

API 키는 서버가 아닌 브라우저 로컬 스토리지에 저장됩니다. 서버에 별도로 설정할 필요 없습니다.

## 동작 원리

```
사용자 메시지
    │
    ▼
[Claude Haiku] 요청 분류 → 적합한 전문가 선택
    │
    ▼
[Claude Sonnet] 선택된 에이전트의 페르소나로 응답 스트리밍
    │
    ▼
SSE로 실시간 전달 → 화면에 즉시 렌더링
```

1. 메시지를 보내면 **Claude Haiku**가 16개 전문 영역 중 가장 적합한 에이전트를 선택합니다.
2. 선택된 에이전트의 한국어 페르소나 시스템 프롬프트 + 전문 플러그인 지식이 결합됩니다.
3. **Claude Sonnet**이 스트리밍으로 답변을 생성하고, SSE를 통해 실시간으로 전달됩니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **UI 컴포넌트**: Radix UI, shadcn/ui
- **AI SDK**: Anthropic SDK (`@anthropic-ai/sdk`)
- **마크다운**: react-markdown, remark-gfm
- **배포**: Vercel

## 배포

Vercel에 바로 배포할 수 있습니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/business-ai-web)

`vercel.json`에 API 함수 최대 실행 시간(60초)이 설정되어 있습니다.

## 플러그인으로 전문 지식 추가

`plugins/<플러그인명>/skills/<스킬명>/SKILL.md` 파일을 추가하면 해당 에이전트의 시스템 프롬프트에 자동으로 포함됩니다.

```
plugins/
└── marketing/
    └── skills/
        └── brand-voice/
            └── SKILL.md   ← 마케팅 에이전트에 자동 주입
```

`lib/agents/skills-loader.ts`의 `AGENT_PLUGIN_MAP`에서 각 에이전트가 사용할 플러그인을 지정합니다.

## 라이선스

MIT
