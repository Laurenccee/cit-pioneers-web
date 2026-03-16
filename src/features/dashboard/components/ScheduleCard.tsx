import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ScheduleCard() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>Schedule for today</CardTitle>
        <CardDescription>Your academic schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-xl font-medium text-foreground">
            No upcoming events
          </p>
          <p className=" text-base text-muted-foreground">
            Events will appear here once they are scheduled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
