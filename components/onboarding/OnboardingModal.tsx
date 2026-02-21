'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setApiKey } from '@/lib/storage/conversations'

interface Props {
  onComplete: (apiKey: string) => void
}

type Step = 'intro' | 'guide' | 'input' | 'done'

export function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('intro')
  const [apiKey, setApiKeyState] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  async function handleValidate() {
    if (!apiKey.trim()) {
      setError('API 키를 입력해주세요.')
      return
    }
    setIsValidating(true)
    setError('')
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setStep('done')
      } else {
        setError(data.error ?? 'API 키 확인에 실패했습니다.')
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsValidating(false)
    }
  }

  function handleComplete() {
    setApiKey(apiKey.trim())
    onComplete(apiKey.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">

        {/* Step indicators */}
        <div className="flex h-1">
          {(['intro', 'guide', 'input', 'done'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 transition-colors duration-300 ${
                ['intro', 'guide', 'input', 'done'].indexOf(step) >= i
                  ? 'bg-blue-500'
                  : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="text-5xl">🤖</div>
                <h1 className="text-2xl font-bold text-white">Business AI Team</h1>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  마케팅, 재무, 법무, HR 등 16개 AI 전문가 팀이<br />
                  비즈니스 업무를 함께 처리해드립니다.
                </p>
              </div>
              <div className="space-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>무료 — 본인 Anthropic API 키 사용</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>대화 기록은 내 브라우저에만 저장</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>파일 첨부 및 이미지 분석 지원</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setStep('guide')}>
                시작하기 →
              </Button>
            </div>
          )}

          {step === 'guide' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">API 키 발급 방법</h2>
                <p className="text-zinc-400 text-sm">Anthropic API 키가 필요합니다. 아래 순서대로 발급하세요.</p>
              </div>
              <ol className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="text-white font-medium">console.anthropic.com 접속</p>
                    <p className="text-zinc-400">계정이 없다면 회원가입 후 이메일 인증</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="text-white font-medium">Settings → API Keys 클릭</p>
                    <p className="text-zinc-400">좌측 메뉴에서 Settings를 선택하세요</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="text-white font-medium">Create Key 버튼 클릭</p>
                    <p className="text-zinc-400">키 이름을 입력하고 생성하세요</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                  <div>
                    <p className="text-white font-medium">키 복사 (sk-ant-로 시작)</p>
                    <p className="text-zinc-400 text-xs">⚠️ 생성 직후 한 번만 보입니다. 반드시 복사해 두세요.</p>
                  </div>
                </li>
              </ol>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => setStep('intro')}>
                  이전
                </Button>
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
                    콘솔 열기 ↗
                  </Button>
                </a>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setStep('input')}>
                  다음 →
                </Button>
              </div>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">API 키 입력</h2>
                <p className="text-zinc-400 text-sm">발급받은 Anthropic API 키를 붙여넣으세요.</p>
              </div>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={e => { setApiKeyState(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleValidate()}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                  autoFocus
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <p className="text-zinc-500 text-xs">
                  키는 브라우저 로컬 스토리지에만 저장됩니다. 서버로 전송되지 않습니다.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={() => setStep('guide')}>
                  이전
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                  onClick={handleValidate}
                  disabled={isValidating}
                >
                  {isValidating ? '확인 중...' : '확인 →'}
                </Button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="space-y-6 text-center">
              <div className="space-y-3">
                <div className="text-5xl">🎉</div>
                <h2 className="text-xl font-bold text-white">준비 완료!</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  API 키가 확인됐습니다.<br />
                  이제 AI 전문가 팀과 대화를 시작하세요.
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 text-sm text-zinc-400 text-left space-y-1">
                <p className="font-medium text-zinc-300">💡 이렇게 물어보세요</p>
                <p>&quot;Q3 마케팅 캠페인 기획 도와줘&quot;</p>
                <p>&quot;투자자 제안서 초안 작성해줘&quot;</p>
                <p>&quot;직원 성과 평가 프레임워크 만들어줘&quot;</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" onClick={handleComplete}>
                시작하기 →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
