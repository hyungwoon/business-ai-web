---
name: tech-leadership
description: Guide technology strategy, architecture decisions, engineering team management, and technical roadmap planning. Use when evaluating technology stacks, reviewing system architecture, managing engineering teams, planning technical debt reduction, or building engineering culture.
---

# Tech Leadership Skill

Frameworks for technology strategy, system architecture, engineering management, and technical decision-making.

## 기술 전략 수립

### 기술 비전 문서 구조

```
기술 비전 문서 (Tech Vision Document)
작성 주기: 연 1회 (연초) + 분기별 리뷰

1. 현재 상태 진단
   - 현재 아키텍처 개요 (다이어그램)
   - 주요 기술 부채 목록
   - 팀 역량 맵
   - 현재 시스템 성능/가용성 지표

2. 목표 상태 (12-18개월)
   - 목표 아키텍처
   - 성능/확장성 목표 (RPS, 레이턴시 P99, 가용성 %)
   - 팀 구성 목표

3. 로드맵
   - Q1-Q4 기술 이니셔티브 우선순위
   - 각 이니셔티브별 예상 임팩트 + 비용
   - 의존성 맵

4. 리스크 및 가정
   - 기술적 리스크 TOP 5
   - 외부 의존성 (벤더, 오픈소스)
```

### 기술 스택 선택 프레임워크

기술 선택 시 평가 기준:

| 기준 | 가중치 | 평가 요소 |
|---|---|---|
| 팀 역량 | 30% | 현재 팀의 숙련도, 학습 곡선 |
| 커뮤니티/에코시스템 | 20% | GitHub 활성도, 문서 품질, 취업 시장 |
| 성능/확장성 | 20% | 벤치마크, 기존 레퍼런스 |
| 운영 복잡도 | 15% | 모니터링, 디버깅, 배포 용이성 |
| 비용 | 10% | 라이선스, 인프라, 인력 채용 비용 |
| 장기 지속성 | 5% | 벤더 안정성, 오픈소스 거버넌스 |

**Build vs Buy vs Open Source 결정 트리:**
- 핵심 경쟁력 영역 → **Build** (차별화 원천)
- 비핵심 + 성숙한 솔루션 존재 → **Buy** (SaaS/상용)
- 비핵심 + 커스터마이징 필요 → **Open Source**

---

## 시스템 아키텍처

### 아키텍처 설계 원칙

**신뢰성 (Reliability):**
- 단일 장애점(SPOF) 제거
- Circuit Breaker 패턴으로 연쇄 장애 방지
- Graceful Degradation (핵심 기능 우선 보호)
- 목표: 가용성 99.9% (월 다운타임 43분) ~ 99.99% (4분)

**확장성 (Scalability):**
- 수평 확장 설계 (Stateless 서비스)
- 캐시 전략: Read-through / Write-behind
- 데이터베이스 샤딩 시점 기준: 단일 DB 5000 TPS 초과
- CDN 활용: 정적 자산 + API 엣지 캐싱

**유지보수성 (Maintainability):**
- 마이크로서비스 분리 기준: 팀 단위 (Conway's Law)
- API 버저닝: URL 버저닝 (`/v1/`, `/v2/`) 또는 헤더
- 모놀리스 → 마이크로서비스: 트래픽 급증 또는 팀 5명+ 시점

### 기술 부채 관리

**부채 분류 (Martin Fowler Technical Debt Quadrant):**

```
                    신중한(Deliberate)
                         ↑
무분별한(Reckless) ←————————————→ 현명한(Prudent)
                         ↓
                    부주의한(Inadvertent)
```

- **현명한 + 신중한:** 출시 후 리팩토링 계획 있음 → 허용
- **현명한 + 부주의한:** 더 나은 방법을 나중에 발견 → 학습 기회
- **무분별한 + 신중한:** "지금은 대충" → 경고 신호
- **무분별한 + 부주의한:** 실수로 발생한 나쁜 코드 → 즉시 수정

**기술 부채 스프린트 비율:**
- 전체 엔지니어링 용량의 20-25%를 기술 부채/인프라에 지속 투자
- "Innovation Token": 불확실한 기술 선택 최대 3개 동시 허용

---

## 엔지니어링 팀 관리

### 1:1 미팅 가이드

**주간 1:1 (30분) 어젠다:**
```
1. 현황 공유 (5분)
   - 이번 주 진행 중인 것
   - 막히는 것/도움 필요한 것

2. 성장 & 피드백 (15분)
   - 최근 잘한 것 1가지 (구체적)
   - 개선 가능한 것 1가지 (행동 가능한 수준)

3. 커리어 & 동기 (5분)
   - 요즘 가장 의미 있다고 느끼는 일은?
   - 다음에 배우고 싶은 것은?

4. 기타 (5분)
   - 팀/조직에 대한 피드백
   - 팀장이 도울 수 있는 것
```

### 엔지니어 레벨 정의 (Leveling)

| 레벨 | 칭호 | 범위 | 핵심 역량 |
|---|---|---|---|
| L1 | Junior Engineer | 개인 태스크 | 지시에 따라 구현, 코드리뷰 참여 |
| L2 | Engineer | 개인 기능 | 독립적 기능 설계+구현, 주도적 PR |
| L3 | Senior Engineer | 팀 내 모듈 | 설계 주도, 주니어 멘토링, 기술 결정 |
| L4 | Staff Engineer | 팀 간 시스템 | 크로스팀 아키텍처, 기술 전략 기여 |
| L5 | Principal Engineer | 조직 전체 | 기술 비전 수립, 채용 기준 정의 |
| M1 | Engineering Manager | 팀 (5-8인) | 인재 관리, 프로세스, 팀 문화 |
| M2 | Senior EM / Director | 팀군 (15-25인) | 조직 설계, 로드맵, 채용 전략 |

### 개발 프로세스 (Agile/Scrum)

**스프린트 체계:**
- 스프린트 길이: 2주 (권장)
- 스프린트 용량 계산: 팀원 수 × 8일 × 0.7 (여유 30%)
- 백로그 리파인먼트: 주 1회 1시간
- 스프린트 리뷰: 스테이크홀더에게 데모
- 레트로스펙티브: 매 스프린트 종료 후 (Start/Stop/Continue)

**코드리뷰 기준:**
```
PR 크기: 400라인 이하 권장 (초과 시 분할 요청)
리뷰 응답 시간: 영업일 기준 1일 이내
승인 기준: 최소 1명 (Senior 이상) 승인
자동화: CI/CD 테스트 통과 필수

리뷰어 체크리스트:
□ 기능이 요구사항 충족하는가?
□ 엣지케이스 처리됐는가?
□ 테스트 커버리지 충분한가?
□ 성능 문제 없는가? (N+1, 루프 내 DB 쿼리)
□ 보안 취약점 없는가?
□ 코드 가독성/유지보수성 양호한가?
```

---

## 엔지니어링 메트릭 (DORA Metrics)

개발 조직 건강 지표 4가지:

| 지표 | 정의 | Elite | High | Medium | Low |
|---|---|---|---|---|---|
| **배포 빈도** | 프로덕션 배포 횟수 | 일 1회+ | 주 1회 | 월 1회 | 6개월 1회 |
| **변경 리드타임** | 커밋 → 배포 시간 | < 1시간 | < 1일 | 1주-1달 | 1달+ |
| **변경 실패율** | 배포 후 롤백 비율 | < 5% | 5-10% | 10-15% | > 15% |
| **복구 시간 (MTTR)** | 인시던트 → 복구 | < 1시간 | < 1일 | 1일-1주 | 1주+ |

**측정 및 개선 방법:**
- GitHub Actions 또는 Jira로 배포 빈도/리드타임 추적
- PagerDuty/OpsGenie로 MTTR 자동 계산
- 분기별 DORA 지표 팀 공유 + 개선 목표 설정

---

## 온콜 & 운영

### SLO/SLI/SLA 설계

```
SLI (Service Level Indicator): 측정하는 지표
  - 가용성: (성공 요청 / 전체 요청) × 100
  - 레이턴시: P99 응답 시간
  - 처리량: 초당 요청 수 (RPS)

SLO (Service Level Objective): 내부 목표
  - 가용성 99.9% (월간)
  - P99 레이턴시 < 500ms
  - 오류율 < 0.1%

SLA (Service Level Agreement): 외부 약속 (SLO보다 낮게 설정)
  - 가용성 99.5% (여유분 0.4% 확보)

에러 버짓 (Error Budget):
  월 43,200분 × (1 - 0.999) = 43.2분 다운타임 허용
  → 에러 버짓 소진 속도 모니터링 → 소진 빠르면 신규 기능 개발 중단
```
