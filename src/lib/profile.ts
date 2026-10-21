import { getCurrentUser } from "@/lib/auth";

type Buyer = {
  id: string;
  displayName: string;
  email: string;
};

export async function getBuyerProfile(
  signal?: AbortSignal,
): Promise<Buyer> {
  const user = await getCurrentUser(signal);

  return {
    id: String(user.id),
    displayName: user.display_name,
    email: user.email,
  };
}