import primaryLogo from "../assets/bcgw-logo.png";

export default function MfaEnrollPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <img
          className="h-50 w-50 object-contain"
          src={primaryLogo}
          alt="BCGW Logo"
        />
        <h2 className="font-semibold mb-2">Enroll in 2-Factor Authentication</h2>
        <h3>For security reasons, your account must be enrolled in SMS 2FA.</h3>
        <p className="mb-4">Once the email is sent, click the link within the email and then refresh this page.</p>
      </div>
    </>
  )
}
