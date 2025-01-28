import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PendingApplicantCard = ({
  firstName,
  lastName,
  email,
  onApprove,
  onReject,
}) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => setShowApproveDialog(true)}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Applicant</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {firstName} {lastName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => {
                setShowApproveDialog(false);
                onApprove(); // Call the onApprove handler
              }}
            >
              Confirm Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Applicant</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {firstName} {lastName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowRejectDialog(false);
                onReject(); // Call the onReject handler
              }}
            >
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PendingApplicantCard;
