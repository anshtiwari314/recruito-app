export default function OpenJobsTable{
    return (
        <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Open Jobs</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>J001</TableCell>
                <TableCell>Data Scientist</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Edit Job Details</DialogTitle>
                      Edit Job Details Form Here
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Resumes</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Upload Resumes</DialogTitle>
                      <Input type="file" multiple />
                      <Button className="mt-2">Upload</Button>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Candidates</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Candidates for Job J001</DialogTitle>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Interview Score</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>John Doe</TableCell>
                            <TableCell>Shortlisted</TableCell>
                            <TableCell>8.5</TableCell>
                            <TableCell><Button>Schedule Interview</Button></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Sample Questions</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Sample Questions</DialogTitle>
                      <Textarea placeholder="Paste sample questions here" rows={6} />
                      <Button className="mt-2">Save</Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
}