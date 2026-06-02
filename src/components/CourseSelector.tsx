import React, { useState } from 'react';
import { Plus, Trash2, Edit3, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CourseData, createCourseFromTemplate } from '@/utils/storage';
import { GRADING_TEMPLATES } from '@/utils/gradingSystems';
import { Label } from '@/components/ui/label';

interface CourseSelectorProps {
  courses: CourseData[];
  activeCourseId: string | null;
  onCourseSelect: (courseId: string) => void;
  onCourseCreate: (course: CourseData) => void;
  onCourseDelete: (courseId: string) => void;
  onCourseUpdate: (course: CourseData) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  activeCourseId,
  onCourseSelect,
  onCourseCreate,
  onCourseDelete,
  onCourseUpdate,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(GRADING_TEMPLATES[0].id);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);

  const handleCreateCourse = () => {
    if (newCourseName.trim()) {
      const newCourse = createCourseFromTemplate(newCourseName.trim(), selectedTemplateId);
      onCourseCreate(newCourse);
      setNewCourseName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditCourse = () => {
    if (editingCourse && newCourseName.trim()) {
      const updatedCourse = { ...editingCourse, name: newCourseName.trim() };
      onCourseUpdate(updatedCourse);
      setEditingCourse(null);
      setNewCourseName('');
      setIsEditDialogOpen(false);
    }
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);

  return (
    <div className="flex flex-col gap-4 items-stretch justify-between mb-4 p-5 bg-muted/30 rounded-[2rem] border border-primary/5 shadow-inner">
      <div className="flex flex-col gap-3 items-stretch flex-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Subject Registry</label>
        <Select value={activeCourseId || ''} onValueChange={onCourseSelect}>
          <SelectTrigger className="w-full h-14 bg-background border border-primary/5 rounded-2xl font-bold shadow-sm transition-all focus:ring-primary/20">
            <SelectValue placeholder="Select a subject stream">
              {activeCourse?.name || 'Select a subject stream'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-primary/10 shadow-xl">
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id} className="rounded-xl font-medium focus:bg-primary/10 focus:text-primary">
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 bg-primary/5 border-primary/10 hover:bg-primary/10 transition-all active:scale-95 shadow-sm">
              <Plus className="w-3.5 h-3.5 text-primary" />
              Add Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] border-primary/10 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-foreground">New Subject Stream</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject Name</Label>
                <Input
                  placeholder="e.g., Structural Theory II"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="h-12 rounded-xl border-primary/10 bg-muted/20 focus:ring-primary/20 font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Grading Template</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-muted/20 shadow-sm">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10 shadow-lg">
                    {GRADING_TEMPLATES.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="rounded-lg">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-bold text-xs">{t.name}</span>
                          <span className="text-[9px] opacity-60 leading-none">{t.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60">
                Cancel
              </Button>
              <Button onClick={handleCreateCourse} disabled={!newCourseName.trim()} className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all">
                Initiate Stream
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {activeCourse && (
          <>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-primary/10 bg-muted/20 shadow-sm active:scale-95 group transition-all">
                  <Edit3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-primary/10 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-foreground">Rename Stream</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Subject name"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="h-12 rounded-xl border-primary/10 bg-muted/20"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl text-[10px] font-black uppercase tracking-widest opacity-60">
                    Cancel
                  </Button>
                  <Button onClick={handleEditCourse} disabled={!newCourseName.trim()} className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all">
                    Update Registry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-destructive/10 bg-destructive/5 shadow-sm active:scale-95 group transition-all">
                  <Trash2 className="w-4 h-4 text-destructive/50 group-hover:text-destructive transition-colors" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem] border-destructive/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black text-destructive">Terminate Stream?</AlertDialogTitle>
                  <AlertDialogDescription className="font-medium text-muted-foreground/80">
                    Are you absolutely sure you want to delete "{activeCourse.name}"? This record will be permanently purged from the registry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="rounded-xl text-[10px] font-black uppercase tracking-widest border-none hover:bg-muted shadow-none">Abort</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCourseDelete(activeCourse.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-sm shadow-destructive/20 transition-all active:scale-95"
                  >
                    Purge Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseSelector;