import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Fingerprint, Delete, Shield, CheckCircle2, Lock, Clock, Info } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';
import { isBiometricsSupported, authenticateWithBiometrics } from '../../utils/biometrics';
import { normalizeArabicNumerals } from '../../utils/calculations';
import { useBackHandler } from '../../hooks/useBackHandler';

interface LockScreenProps {
  onUnlock: () => void;
  savedPasscode?: string;
  biometricEnabled?: boolean;
  language?: 'en' | 'ar';
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  savedPasscode = '123456',
  biometricEnabled = true,
  language = 'ar',
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBiometricChecking, setIsBiometricChecking] = useState(false);
  const [showForgotSecurityNotice, setShowForgotSecurityNotice] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    biometricEnabled
      ? (language === 'ar' ? 'أدخل رمز المرور (6 أرقام) أو استخدم البصمة' : 'Enter 6-digit passcode or use biometrics')
      : (language === 'ar' ? 'أدخل رمز المرور (6 أرقام) لفتح التطبيق' : 'Enter 6-digit passcode to unlock')
  );

  const hasAutoPromptedRef = useRef(false);
  const targetPasscode = savedPasscode || '123456';

  // Countdown timer for brute-force rate-limiting
  useEffect(() => {
    if (lockoutSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setLockoutSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setStatusMessage(
            biometricEnabled
              ? (language === 'ar' ? 'يمكنك الآن إدخال رمز المرور أو استخدام البصمة' : 'You can now enter passcode or use biometrics')
              : (language === 'ar' ? 'يمكنك الآن إدخال رمز المرور' : 'You can now enter passcode')
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSecondsLeft, biometricEnabled, language]);

  const handleUnlockSuccess = useCallback(() => {
    setIsSuccess(true);
    triggerHaptic('success');
    setFailedAttempts(0);
    setLockoutSecondsLeft(0);
    setStatusMessage(language === 'ar' ? 'تم تأكيد الهوية بنجاح' : 'Authenticated successfully');
    setTimeout(() => {
      onUnlock();
    }, 300);
  }, [language, onUnlock]);

  const handleBiometricAuth = useCallback(async () => {
    if (isSuccess) return;
    triggerHaptic('medium');
    setIsBiometricChecking(true);
    setStatusMessage(language === 'ar' ? 'جارٍ المسح بالبصمة...' : 'Scanning biometrics...');

    try {
      const res = await authenticateWithBiometrics();
      setIsBiometricChecking(false);

      if (res.success) {
        handleUnlockSuccess();
      } else if (res.error === 'unsupported') {
        setStatusMessage(
          language === 'ar'
            ? 'البصمة غير مدعومة في هذا الجهاز'
            : 'Biometrics not supported on this device'
        );
      } else if (res.error === 'cancelled_or_denied') {
        setStatusMessage(
          lockoutSecondsLeft > 0
            ? (language === 'ar' ? `المحاولات مقفلة. انتظر ${lockoutSecondsLeft} ثانية أو اضغط البصمة` : `Locked. Wait ${lockoutSecondsLeft}s or tap biometrics`)
            : (language === 'ar' ? 'تم إلغاء البصمة، استخدم الرمز (6 أرقام)' : 'Biometric cancelled, enter 6-digit PIN')
        );
      } else {
        triggerHaptic('error');
        setErrorShake(true);
        setStatusMessage(language === 'ar' ? 'فشلت مطابقة البصمة، استخدم الرمز' : 'Biometric failed, use PIN');
        setTimeout(() => setErrorShake(false), 500);
      }
    } catch {
      setIsBiometricChecking(false);
    }
  }, [handleUnlockSuccess, isSuccess, language, lockoutSecondsLeft]);

  // Auto-prompt biometrics once on mount if enabled
  useEffect(() => {
    if (!biometricEnabled || hasAutoPromptedRef.current) return;
    hasAutoPromptedRef.current = true;

    const timer = setTimeout(() => {
      isBiometricsSupported().then(supported => {
        if (supported) {
          handleBiometricAuth();
        }
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [biometricEnabled, handleBiometricAuth]);

  const handleKeyPress = (digit: string) => {
    if (lockoutSecondsLeft > 0) {
      triggerHaptic('error');
      return;
    }
    if (pin.length >= 6 || isSuccess) return;
    triggerHaptic('light');
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 6) {
      if (newPin === targetPasscode) {
        handleUnlockSuccess();
      } else {
        triggerHaptic('error');
        setErrorShake(true);
        const nextFails = failedAttempts + 1;
        setFailedAttempts(nextFails);

        if (nextFails >= 5) {
          const lockoutTime = nextFails >= 10 ? 300 : 60;
          setLockoutSecondsLeft(lockoutTime);
          setStatusMessage(
            language === 'ar'
              ? `محاولات خاطئة كثيرة. انتظر ${lockoutTime} ثانية أو استخدم البصمة`
              : `Too many wrong attempts. Wait ${lockoutTime}s or use biometrics`
          );
        } else {
          const remaining = 5 - nextFails;
          setStatusMessage(
            language === 'ar'
              ? `رمز المرور غير صحيح (${remaining} محاولات متبقية)`
              : `Incorrect passcode (${remaining} attempts left)`
          );
        }

        setTimeout(() => {
          setPin('');
          setErrorShake(false);
        }, 500);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess || lockoutSecondsLeft > 0) return;
      const normalizedKey = normalizeArabicNumerals(e.key);
      if (/^[0-9]$/.test(normalizedKey)) {
        handleKeyPress(normalizedKey);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess, targetPasscode, lockoutSecondsLeft]);

  const handleDelete = () => {
    if (lockoutSecondsLeft > 0) return;
    if (pin.length === 0 || isSuccess) return;
    triggerHaptic('light');
    setPin(prev => prev.slice(0, -1));
  };

  const handleForgotPinClick = () => {
    setShowForgotSecurityNotice(true);
  };

  useBackHandler(showForgotSecurityNotice, () => setShowForgotSecurityNotice(false), 'lock-forgot-notice');

  const isKeypadDisabled = lockoutSecondsLeft > 0 || isSuccess;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-slate-950 text-white select-none animate-in fade-in duration-200">
      {/* Top Header & Lock Badge */}
      <div className="w-full pt-6 sm:pt-8 flex flex-col items-center text-center space-y-3">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${
          isSuccess 
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 scale-105' 
            : lockoutSecondsLeft > 0
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 animate-pulse'
              : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
        }`}>
          {isSuccess ? (
            <CheckCircle2 size={32} className="text-emerald-400" />
          ) : lockoutSecondsLeft > 0 ? (
            <Clock size={30} className="text-amber-400" />
          ) : (
            <Lock size={30} />
          )}
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-100">
            {language === 'ar' ? 'مصروفي محمي' : 'Masrofy is Locked'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 min-h-[1.25rem] px-2 font-medium">
            {statusMessage}
          </p>
        </div>

        {/* 6-digit PIN Dots or Lockout Badge */}
        {lockoutSecondsLeft > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-in fade-in">
            <Clock size={14} />
            <span>
              {language === 'ar' ? `متبقي ${lockoutSecondsLeft} ثانية` : `${lockoutSecondsLeft}s remaining`}
            </span>
          </div>
        ) : (
          <div className={`flex items-center gap-3 pt-2 ${errorShake ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3, 4, 5].map(idx => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                  pin.length > idx
                    ? (isSuccess 
                        ? 'bg-emerald-400 border-emerald-400 scale-110 shadow-sm shadow-emerald-400/50' 
                        : errorShake 
                          ? 'bg-rose-500 border-rose-500' 
                          : 'bg-blue-500 border-blue-500 scale-110 shadow-sm shadow-blue-500/50')
                    : 'border-slate-700 bg-slate-900/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Center Biometric Button (Always Accessible for Owner) */}
      {biometricEnabled && (
        <div className="py-1 flex flex-col items-center">
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={isBiometricChecking || isSuccess}
            className={`p-3.5 rounded-3xl border text-blue-400 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              isBiometricChecking 
                ? 'bg-blue-600/25 border-blue-500/60 scale-105 ring-2 ring-blue-500/40' 
                : 'bg-blue-600/10 hover:bg-blue-600/20 active:scale-95 border-blue-500/30 shadow-lg'
            }`}
          >
            <Fingerprint size={38} className={isBiometricChecking ? 'animate-pulse text-blue-300' : ''} />
            <span className="text-[11px] font-bold text-slate-300">
              {isBiometricChecking 
                ? (language === 'ar' ? 'جارٍ الفحص...' : 'Scanning...') 
                : (language === 'ar' ? 'اضغط للمصادقة بالبصمة' : 'Tap for Biometrics')}
            </span>
          </button>
        </div>
      )}

      {/* Numeric Keypad (Always English Digits 0-9) */}
      <div className="w-full max-w-xs pb-4 space-y-2.5" dir="ltr">
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              type="button"
              disabled={isKeypadDisabled}
              onClick={() => handleKeyPress(digit)}
              className={`h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${
                isKeypadDisabled
                  ? 'bg-slate-900/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
                  : 'bg-slate-900/80 hover:bg-slate-800 active:bg-blue-600/30 text-white cursor-pointer border-slate-800 active:scale-95'
              }`}
            >
              {digit}
            </button>
          ))}
          
          {/* Bottom Row: Fingerprint Shortcut, 0, Backspace */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={!biometricEnabled || isSuccess}
            className={`h-13 rounded-2xl flex items-center justify-center transition-all cursor-pointer border select-none active:scale-95 ${
              biometricEnabled 
                ? 'bg-slate-900/40 hover:bg-slate-800/60 text-blue-400 border-slate-800' 
                : 'opacity-20 cursor-not-allowed border-transparent'
            }`}
            title="Biometrics"
          >
            <Fingerprint size={22} />
          </button>

          <button
            type="button"
            disabled={isKeypadDisabled}
            onClick={() => handleKeyPress('0')}
            className={`h-13 rounded-2xl text-xl font-mono font-bold flex items-center justify-center transition-all select-none border shadow-2xs ${
              isKeypadDisabled
                ? 'bg-slate-900/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
                : 'bg-slate-900/80 hover:bg-slate-800 active:bg-blue-600/30 text-white cursor-pointer border-slate-800 active:scale-95'
            }`}
          >
            0
          </button>

          <button
            type="button"
            disabled={isKeypadDisabled}
            onClick={handleDelete}
            className={`h-13 rounded-2xl flex items-center justify-center transition-all select-none border ${
              isKeypadDisabled
                ? 'bg-slate-900/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-50'
                : 'bg-slate-900/40 hover:bg-slate-800/60 active:scale-95 text-slate-300 cursor-pointer border-slate-800'
            }`}
            title="Delete"
          >
            <Delete size={20} />
          </button>
        </div>

        {/* Secure Forgot PIN Guidance */}
        <div className="text-center pt-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <button
            type="button"
            onClick={handleForgotPinClick}
            className="text-[11px] text-slate-400 hover:text-blue-400 underline cursor-pointer transition-colors"
          >
            {language === 'ar' ? 'نسيت رمز المرور؟' : 'Forgot Passcode?'}
          </button>
        </div>
      </div>

      {/* Secure Forgot PIN Modal (No Wipe, Biometric Recovery Only) */}
      {showForgotSecurityNotice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'ar' ? 'استعادة الوصول بأمان' : 'Secure Access Recovery'}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed text-start">
                {language === 'ar' 
                  ? 'لحماية خصوصيتك ومنع أي شخص متطفل من الاطلاع على بياناتك أو العبث بها، لا يمكن فتح التطبيق إلا عبر رمز المرور أو بصمة الإصبع.\n\nإذا نسيت رمز المرور، يرجى المصادقة ببصمة الإصبع لتأكيد هويتك كمالك للجهاز وفتح التطبيق فوراً.' 
                  : 'To protect your privacy and ensure no unauthorized person can view or tamper with your records, the app requires your PIN or biometric verification.\n\nIf you forgot your PIN, please authenticate using your registered fingerprint.'}
              </p>
            </div>

            {/* Security Explanation Box */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-start flex items-start gap-2">
              <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? 'ملاحظة لحماية أمانك: لا توجد أي خيارات لمسح البيانات من شاشة القفل لمنع ضياع سجلاتك إذا وقع الهاتف في يد شخص آخر.'
                  : 'Security policy: No data wipe option exists on the lock screen to prevent accidental or malicious data loss.'}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {biometricEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotSecurityNotice(false);
                    handleBiometricAuth();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Fingerprint size={16} />
                  <span>{language === 'ar' ? 'فتح التطبيق ببصمة الإصبع' : 'Unlock with Biometrics'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowForgotSecurityNotice(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'ar' ? 'العودة ومحاولة إدخال الرمز' : 'Try Passcode Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
