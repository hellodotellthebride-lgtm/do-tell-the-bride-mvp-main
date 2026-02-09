import React, { useEffect, useMemo, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function CreateAccountScreen({ onBack }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);

  const pwMatch = useMemo(() => pw.length > 0 && pw === pw2, [pw, pw2]);
  const canSubmit = email.trim() && pw.length >= 6 && pw2.length >= 6 && pwMatch;

  useEffect(() => {
    let mounted = true;
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (mounted) {
          setAppleAvailable(available);
        }
      })
      .catch(() => {
        if (mounted) {
          setAppleAvailable(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleAppleSignIn = async () => {
    console.log('pressed');
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      console.log('APPLE AVAILABLE:', available);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log('APPLE CREDENTIAL:', credential);
      console.log('IDENTITY TOKEN:', credential?.identityToken);
    } catch (error) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        return;
      }
      console.warn('Apple sign-in failed', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex flex-col">
      <TopBack show onClick={onBack} />

      <div className="mt-4 text-center">
        <SerifTitle className="text-[52px] sm:text-[56px]">
          Create your
          <br />
          <span className="underline underline-offset-8 decoration-[#2B2B2B]/20">
            account
          </span>
        </SerifTitle>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {appleAvailable ? (
          <div>
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={{ width: '100%', height: 48 }}
              onPress={handleAppleSignIn}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <div className="h-px bg-[#D9D2CA] flex-1" />
          <div className="text-[12px] text-[#B9B2AA]">or create an account with email</div>
          <div className="h-px bg-[#D9D2CA] flex-1" />
        </div>

        <div className="space-y-7">
          <UnderlineInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          <UnderlineInput
            label="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            type="password"
            autoComplete="new-password"
          />
          <UnderlineInput
            label="Confirm password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            type="password"
            autoComplete="new-password"
          />

          <div className="text-[12px] text-[#B9B2AA] -mt-2">
            We'll only use this to save your progress.
          </div>

          {pw2.length > 0 && !pwMatch ? (
            <div className="text-[12px] text-[#2B2B2B]/70">
              Passwords don’t match (annoying, but fixable).
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-auto pb-2 pt-8">
        <PrimaryButton
          disabled={!canSubmit}
          onClick={() => {
            alert('Create account stub');
          }}
        >
          Create account
        </PrimaryButton>
      </div>
    </div>
  );
}

function TopBack({ show, onClick }) {
  return (
    <div className="h-10">
      {show ? (
        <button
          onClick={onClick}
          aria-label="Go back"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-60">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full rounded-full py-4 text-white font-semibold text-[16px]',
        'bg-[#FF9B85] shadow-sm',
        'active:scale-[0.99] transition-transform',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function SerifTitle({ children, className = '' }) {
  return (
    <h1
      className={[
        'font-serif text-[#2B2B2B]',
        'leading-[0.95] tracking-[-0.02em]',
        className,
      ].join(' ')}
      style={{
        fontFamily:
          'Playfair Display, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      }}
    >
      {children}
    </h1>
  );
}

function UnderlineInput({ label, value, onChange, type = 'text', autoComplete }) {
  return (
    <label className="block">
      <div className="text-[16px] text-[#8E867E] mb-3">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full bg-transparent outline-none text-[16px] text-[#2B2B2B] placeholder:text-[#B9B2AA]"
        placeholder=""
      />
      <div className="mt-3 h-px bg-[#D9D2CA]" />
    </label>
  );
}
