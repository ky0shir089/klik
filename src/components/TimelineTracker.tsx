"use client";

import Signature from "@uiw/react-signature";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

interface TimelineEntry {
  id: number;
  status: string;
  updated_at: string;
  user: {
    name: string;
  };
  signature: string;
  remark?: string;
}

export function TimelineTracker({ items }: { items: TimelineEntry[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $svg = useRef<any>(null);

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const path = usePathname();

  return (
    <>
      {path !== "/finance/pv" ? (
        <div className="p-4 border rounded-lg bg-muted/30">
          <h4 className="mb-4 text-sm font-bold uppercase text-muted-foreground">
            Approval History
          </h4>

          <div className="space-y-6">
            {items.map((item, index) => {
              const points = {
                "path-1": JSON.parse(item.signature) ?? [],
              };

              return (
                <div key={item.id} className="relative flex gap-x-3">
                  {index !== items.length - 1 && (
                    <div
                      className="absolute left-[9px] top-6 -ml-px h-full w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative flex items-center justify-center flex-none size-5">
                    {item.status === "APPROVE" && (
                      <CheckCircle2 className="text-green-500 size-5 fill-primary/10" />
                    )}
                    {item.status === "REJECT" && (
                      <XCircle className="size-5 text-destructive fill-destructive/10" />
                    )}
                    {item.status === "PENDING" && (
                      <Clock className="text-yellow-500 size-5 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-auto py-0.5">
                    <div className="flex items-center justify-between gap-x-4">
                      <p className="text-sm font-semibold leading-5 text-foreground">
                        {item.user.name}
                      </p>
                      {item.updated_at && (
                        <time className="flex-none text-xs text-muted-foreground">
                          {formatter.format(new Date(item.updated_at))}
                        </time>
                      )}
                    </div>
                    {item.status && (
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {item.status}
                      </p>
                    )}
                    {points["path-1"].length > 0 ? (
                      <div className="flex items-center justify-center w-full">
                        <div className="w-full h-auto border-2 border-yellow-500 sm:max-w-sm">
                          <Signature
                            ref={$svg}
                            defaultPoints={points}
                            readonly
                          />
                        </div>
                      </div>
                    ) : null}
                    {item.status === "REJECT" && item.remark && (
                      <p className="mt-2 text-sm text-destructive">
                        {item.remark}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
