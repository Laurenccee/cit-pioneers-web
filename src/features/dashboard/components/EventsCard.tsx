'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { events } from '@/lib/data/eventsData';

export default function EventsCard() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          <CardDescription>
            Events and activities scheduled for you
          </CardDescription>
        </div>
        <CardAction
          className="hover:underline text-lg text-primary"
          onClick={() => router.push('/events')}
        >
          View All
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {events.map((event) => (
            <div
              key={event.title}
              className="flex flex-col rounded-md border border-border overflow-hidden hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
              <div className="flex flex-col gap-1.5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className=" text-primary">{event.category}</span>
                  <span className="  text-muted-foreground shrink-0">
                    {event.date}
                  </span>
                </div>
                <p className=" text-lg font-medium text-foreground line-clamp-2">
                  {event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
