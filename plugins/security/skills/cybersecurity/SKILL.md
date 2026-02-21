---
name: cybersecurity
description: Assess cybersecurity posture, design security policies, respond to incidents, and build security awareness programs. Use when conducting risk assessments, reviewing security architecture, drafting security policies, planning incident response, or evaluating vendor security.
---

# Cybersecurity Skill

Frameworks for information security risk management, policy design, incident response, and security awareness in business contexts.

## 보안 위험 평가 (Security Risk Assessment)

### 자산 분류 (Asset Classification)

| 분류 | 정의 | 예시 | 보호 수준 |
|---|---|---|---|
| **극비 (Top Secret)** | 유출 시 사업 존속 위협 | 핵심 소스코드, M&A 정보 | 암호화 + 접근 로그 필수 |
| **기밀 (Confidential)** | 유출 시 심각한 손실 | 고객 개인정보, 재무 데이터 | 역할 기반 접근 통제 |
| **내부 (Internal)** | 외부 미공개 정보 | 내부 문서, 인사 정보 | 직원 접근 제한 |
| **공개 (Public)** | 외부 공개 가능 | 마케팅 자료, 공개 API | 기본 보호 |

### STRIDE 위협 모델링

시스템/서비스 설계 검토 시 6가지 위협 유형을 체계적으로 분석:

| 위협 | 정의 | 예시 | 대응 |
|---|---|---|---|
| **S**poofing | 신원 위조 | 피싱, 세션 하이재킹 | MFA, 디지털 서명 |
| **T**ampering | 데이터 무결성 훼손 | SQL 인젝션, 파일 변조 | 입력 검증, 해시 검증 |
| **R**epudiation | 행위 부인 | 거래 부인, 로그 삭제 | 감사 로그, 전자서명 |
| **I**nformation Disclosure | 정보 노출 | 민감정보 평문 전송 | 암호화, 마스킹 |
| **D**enial of Service | 서비스 거부 | DDoS, 리소스 고갈 | Rate limiting, WAF |
| **E**levation of Privilege | 권한 상승 | sudo 취약점 악용 | 최소 권한 원칙 |

---

## 보안 정책 설계

### 핵심 보안 정책 목록

**반드시 수립해야 할 정책:**

1. **정보보안 정책 (Master Policy)** — 보안의 목적, 범위, 원칙 선언
2. **접근 통제 정책** — 역할 기반 접근(RBAC), 최소 권한 원칙
3. **비밀번호 정책** — 복잡도, 만료 주기, MFA 요구사항
4. **암호화 정책** — 저장 및 전송 데이터 암호화 기준
5. **업무용 기기 정책 (AUP)** — 회사 기기 사용 규정, BYOD 가이드
6. **인시던트 대응 정책** — 보고 절차, 대응 팀, 복구 기준
7. **백업 및 복구 정책** — 백업 주기, 보존 기간, RTO/RPO
8. **공급업체 보안 정책** — 벤더 보안 평가, 계약 요구사항
9. **원격 근무 보안 정책** — VPN, 홈 네트워크, 클라우드 사용 규정
10. **퇴직자 보안 처리 절차** — 계정 비활성화, 기기 반납, 데이터 삭제

### 비밀번호/인증 기준 (NIST SP 800-63B 기반)

```
비밀번호 최소 요구사항:
- 최소 길이: 12자 이상
- 복잡도: 대소문자 + 숫자 + 특수문자 조합
- 만료 주기: 90일 (침해 시 즉시 변경)
- 재사용 제한: 최근 10개 비밀번호 재사용 금지
- 잠금: 5회 연속 실패 시 15분 잠금

다단계 인증 (MFA) 의무 대상:
- 모든 클라우드 서비스 관리자 계정
- 원격 접속 (VPN, SSH)
- 고객 데이터 접근 시스템
- CI/CD 파이프라인

권장 MFA 방식 (강도 순):
1. 하드웨어 보안키 (FIDO2/WebAuthn) — 최강
2. TOTP 앱 (Google Authenticator, Authy)
3. Push 알림 (Duo, Microsoft Authenticator)
4. SMS OTP — 피싱 취약, 최후 수단으로만
```

---

## 인시던트 대응 (Incident Response)

### IR 프로세스 (NIST SP 800-61 기반)

**Phase 1: 준비 (Preparation)**
- IR 팀 구성 및 역할 정의
- IR 도구 준비 (SIEM, EDR, 포렌식 도구)
- 연락처 목록 최신화 (내부 + 외부 — 법무, CERT)
- IR 훈련 및 시뮬레이션 (연 1회 이상)

**Phase 2: 탐지 및 분석 (Detection & Analysis)**

인시던트 심각도 분류:

| 등급 | 기준 | 대응 시간 | 에스컬레이션 |
|---|---|---|---|
| Critical | 랜섬웨어, 데이터 유출 확인 | 즉시 | CISO + CEO + 법무 |
| High | 권한 외 접근, 악성코드 감염 | 1시간 내 | CISO + IT팀장 |
| Medium | 비인가 접근 시도 | 4시간 내 | IT팀장 |
| Low | 의심 활동, 정책 위반 | 24시간 내 | 보안 담당자 |

**Phase 3: 봉쇄 (Containment)**
- 단기 봉쇄: 감염 시스템 네트워크 분리
- 장기 봉쇄: 임시 패치, 접근 통제 강화
- 증거 보존: 포렌식 이미지 확보 전 시스템 수정 금지

**Phase 4: 제거 (Eradication)**
- 악성코드 완전 제거
- 취약점 패치
- 손상된 계정 비활성화 및 재생성

**Phase 5: 복구 (Recovery)**
- 시스템 복원 및 모니터링 강화
- 정상 운영 재개 기준 정의
- 72시간 집중 모니터링

**Phase 6: 사후 학습 (Post-Incident)**
- PIR (Post-Incident Review): 5일 내 실시
- 타임라인 재구성
- 근본 원인 분석 (Root Cause Analysis)
- 재발 방지 조치 이행 계획

---

## 클라우드 보안 체크리스트 (AWS/GCP/Azure 공통)

### 기본 보안 설정

```
IAM/접근 관리:
[ ] 루트/관리자 계정 MFA 활성화
[ ] 역할 기반 접근 통제 (RBAC) 적용
[ ] 서비스 계정 키 정기 로테이션 (90일)
[ ] 미사용 계정/권한 정기 검토 및 삭제

네트워크:
[ ] 기본 보안 그룹 최소 권한 설정 (0.0.0.0/0 금지)
[ ] VPC/서브넷 분리 (공개/내부/DB)
[ ] 불필요한 공개 IP 제거
[ ] WAF 활성화 (웹 서비스)

데이터:
[ ] 저장 데이터 암호화 (서버 사이드)
[ ] 전송 데이터 TLS 1.2+ 강제
[ ] S3/GCS 버킷 공개 접근 차단
[ ] 백업 암호화 및 별도 계정 보관

모니터링:
[ ] CloudTrail/Audit Log 활성화
[ ] 이상 행동 알림 설정 (GuardDuty, Security Command Center)
[ ] 비용 이상 알림 (크립토재킹 탐지)
[ ] 보안 점수 대시보드 주간 검토
```

---

## 보안 인식 교육 프로그램

### 연간 교육 캘린더

| 월 | 주제 | 형식 |
|---|---|---|
| 1 | 비밀번호 관리 & 피싱 식별 | 온라인 모듈 (15분) |
| 3 | 소셜 엔지니어링 시뮬레이션 | 모의 피싱 이메일 발송 |
| 5 | 개인정보보호 (PIPA) | 온라인 모듈 + 퀴즈 |
| 7 | 클라우드/원격근무 보안 | 실시간 세미나 |
| 9 | 인시던트 신고 방법 | 짧은 영상 (5분) |
| 11 | 연간 보안 정책 재서약 | 전직원 서명 |

**효과적인 보안 교육 원칙:**
- 실제 사례 기반 (내부 또는 업계 사례)
- 10-15분 이내 짧은 세션
- 역할별 맞춤 교육 (개발자 vs 영업 vs 임원)
- 게임화 요소 (점수, 배지, 팀 경쟁)
- 분기별 1회 모의 피싱 훈련
