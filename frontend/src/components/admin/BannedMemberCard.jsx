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

const BannedMemberCard = ({
  firstName,
  lastName,
  email,
  banDetails,
  onUnban,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{email}</p>

            {/* Show ban details if available */}
            {banDetails && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  <strong>Reason:</strong> {banDetails.reason || "N/A"}
                </p>
                {banDetails?.banDate && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {banDetails?.banDate.toLocaleDateString()}
                  </p>
                )}
                {banDetails?.issuedBy && (
                  <p>
                    <strong>Banned By:</strong> {banDetails?.issuedBy.firstname}{" "}
                    {banDetails?.issuedBy.lastname}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2 items-center">
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setShowConfirmDialog(true)}
            >
              Unban
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unban</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban {firstName} {lastName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setShowConfirmDialog(false);
                onUnban();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BannedMemberCard;
