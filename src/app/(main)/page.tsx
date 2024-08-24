import { SubmitButton } from "@/components/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { serversList, usersList, domainsList } from "@/lib/cached";
import { prisma } from "@/lib/db";
import { LinkIcon, PlusCircle, ServerIcon, User } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Home() {
  const servers = await serversList();
  const users = await usersList();
  const domains = await domainsList();
  const bannedUsers = users.filter((u) => u.banned);
  return servers.length > 0 ? (
    <div className="flex justify-center items-center h-screen gap-2 flex-col bg-dotted-primary/20 bg-dotted-spacing-6">
      <h1 className="text-xl font-bold">Welcome</h1>
      <section className="flex justify-center items-start gap-4">
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Servers</CardTitle>
            <ServerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servers.length}</div>
            <p className="text-xs text-muted-foreground">
              {servers.length > 0
                ? servers
                    .splice(0, 3)
                    .map((server) => server.name)
                    .join(", ")
                    .slice(0, 20)
                : "No servers"}
              {servers.length > 3 ? `and ${servers.length - 3} more` : ""}
            </p>
          </CardContent>
        </Card>
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {bannedUsers.length} banned user
              {bannedUsers.length === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domains</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">&nbsp;</p>
          </CardContent>
        </Card>
      </section>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen gap-4 flex-col">
      <h1 className="text-xl font-bold">No servers found</h1>
      <h2 className="text-md font-semibold text-muted-foreground">
        Add a server to get started
      </h2>
      <Dialog>
        <DialogTrigger className={buttonVariants()}>
          <PlusCircle className="size-4 mr-2" /> Add server
        </DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle>Add a server</DialogTitle>
            <DialogDescription>
              Make sure the bot is already invited to the server before
              continuing
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-2 w-full"
            action={async (data) => {
              "use server";
              const id = data.get("server_id")?.toString() as string;
              if (servers.map((server) => server.serverId).includes(id)) {
                revalidatePath(`/server/${id}`);
                redirect(`/server/${id}`);
              }
              await prisma.server.create({
                data: {
                  serverId: id,
                },
              });
              revalidatePath(`/server/${id}`);
              redirect(`/server/${id}`);
            }}
          >
            <Input
              placeholder="Server ID"
              name="server_id"
              type="number"
              required
            />
            <SubmitButton>Add server</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
