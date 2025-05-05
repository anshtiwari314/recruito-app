export default function ScheduleMeetingForm{
    return (
        <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Schedule Interview</h2>
          <Input placeholder="Job ID" />
          <Input placeholder="Candidate Email / Name" />
          <Textarea placeholder="Participants (comma-separated emails)" />
          <Input type="datetime-local" />
          <Button>Schedule Meeting</Button>
        </CardContent>
      </Card>
    )
}