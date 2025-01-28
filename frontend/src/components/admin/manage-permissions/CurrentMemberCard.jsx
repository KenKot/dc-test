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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

const CurrentMemberCard = ({ firstName, lastName, email, role, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [banReason, setBanReason] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { user } = useAuthStore();

  // Define dropdown options based on role
  let roleOptions =
    user.role === "admin"
      ? [
          { value: "moderator", label: "Moderator" },
          { value: "member", label: "Member" },
          { value: "alumni", label: "Alumni" },
          { value: "banned", label: "Banned" },
          { value: "admin", label: "Admin" }, // Admin can also keep the user as admin
        ]
      : [
          { value: "member", label: "Member" },
          { value: "alumni", label: "Alumni" },
          { value: "banned", label: "Banned" },
        ];

  // Remove current role from choices
  roleOptions = roleOptions.filter((option) => option.value !== role);

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {firstName} {lastName} ({role})
            </h3>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2 items-center">
            <Select onValueChange={(value) => {
              setSelectedRole(value);
              
              // Clear the ban reason if they switch away from "banned"
              if (value !== "banned") {
                setBanReason("");
              }
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setShowConfirmDialog(true)}
              disabled={!selectedRole} // Disable button if no role is selected
            >
              Update
            </Button>
          </div>
        </div>

        {/* If "banned" is selected, show a text input for ban reason */}
        {selectedRole === "banned" && (
          <div className="mt-4">
            <Label htmlFor="banReason" className="mb-2 font-semibold">
              Ban Reason:
            </Label>
            <Input
              id="banReason"
              placeholder="Enter ban reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to change {firstName} {lastName}'s role to{" "}
              <strong>{selectedRole}</strong>?
              {selectedRole === "banned" && banReason && (
                <div className="mt-2">
                  <strong>Ban Reason:</strong> {banReason}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                setShowConfirmDialog(false);
                // Pass both newRole and banReason to onUpdate
                onUpdate(selectedRole, banReason);
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

export default CurrentMemberCard;
