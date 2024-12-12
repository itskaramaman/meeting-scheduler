import { Suspense } from "react";

const AvailabilityLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense>{children}</Suspense>;
};

export default AvailabilityLayout;
