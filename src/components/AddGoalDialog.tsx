import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Props {
  onAdd: (goal: { id: string; name: string; date: string; color: string }) => void;
}

export default function AddGoalDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("blue");

  const handleSubmit = () => {
    if (!name || !date) return;
    onAdd({ id: crypto.randomUUID(), name, date, color });
    setName("");
    setDate("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add Exam / Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Goal Name</Label>
            <Input
              placeholder="e.g. JEE Mains"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label>Target Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Color Theme</Label>
            <div className="flex gap-2 mt-1">
              {["blue", "orange", "green"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    c === "blue" ? "gradient-primary" : c === "orange" ? "gradient-accent" : "gradient-success"
                  } ${color === c ? "ring-2 ring-ring ring-offset-2" : ""}`}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground">
            Add Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
