import { PurchaseButton } from "./components/purchase-button/purchase-button";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { checkout } = await searchParams;
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="space-y-4">
        {checkout === "success" ? (
          <p className="text-green-500">Payment successful!</p>
        ) : (
          <p className="text-red-500">Payment cancelled.</p>
        )}

        <PurchaseButton />
      </div>
    </main>
  );
}
