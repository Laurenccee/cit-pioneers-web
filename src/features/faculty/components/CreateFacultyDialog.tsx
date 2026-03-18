'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { User, Hash, Plus, X, Mail } from 'lucide-react';
import { useCreateFaculty } from '../hooks/useCreateFaculty';
import {
  degree,
  designation,
  level,
  rank,
  years,
} from '@/lib/data/positionOptions';
import { Toggle } from '@/components/ui/toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateFacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateFacultyDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateFacultyDialogProps) {
  const { form, isPending, onSubmit, onError } = useCreateFaculty({
    onSuccess,
    onClose: () => onOpenChange(false),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!isPending) {
          if (!o) reset();
          onOpenChange(o);
        }
      }}
    >
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Faculty Member</DialogTitle>
          <DialogDescription>
            Create an account and profile for a new faculty member. The default
            password is <strong>P@$$W0rd</strong> — they will be required to
            change it on first login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Account
            </p>

            <div className="space-y-2">
              <Label htmlFor="cs-email">Email</Label>
              <Controller
                name={`email`}
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="cs-email"
                      placeholder="Enter the faculty's email address"
                      disabled={isPending}
                      arial-invalid={!!errors.email}
                    />
                  </InputGroup>
                )}
              />
            </div>
          </div>

          <Separator />
          {/* Personal */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Personal
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cs-firstName">First Name</Label>
                <Controller
                  name={`firstName`}
                  control={control}
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="cs-firstName"
                        placeholder="First name"
                        disabled={isPending}
                        arial-invalid={!!errors.firstName}
                      />
                    </InputGroup>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cs-lastName">Last Name</Label>
                <Controller
                  name={`lastName`}
                  control={control}
                  render={({ field }) => (
                    <InputGroup>
                      <InputGroupAddon>
                        <User />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id="cs-lastName"
                        placeholder="Last name"
                        disabled={isPending}
                        arial-invalid={!!errors.lastName}
                      />
                    </InputGroup>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cs-facultyId">Faculty ID</Label>
              <Controller
                name={`facultyId`}
                control={control}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <Hash />
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      id="cs-facultyId"
                      placeholder="3-digit ID"
                      maxLength={3}
                      disabled={isPending}
                      arial-invalid={!!errors.facultyId}
                    />
                  </InputGroup>
                )}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Designation</Label>
                <Controller
                  name={`designation`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                      aria-invalid={!!fieldState.error}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Designation (Optional)" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {designation.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Rank</Label>
                <Controller
                  name={`rank`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                      aria-invalid={!!fieldState.error}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rank" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {rank.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Education */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Education
              </p>
              <Button
                size="icon-sm"
                variant="ghost"
                className="bg-input text-muted-foreground"
                type="button"
                onClick={() =>
                  append({
                    level: '',
                    degree: '',
                    yearGraduated: '',
                    onGoing: false,
                  })
                }
              >
                <Plus size={12} />
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="flex gap-3">
                  <div className="space-y-2 flex-1">
                    <Label>Level</Label>
                    <Controller
                      name={`education.${index}.level`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                          aria-invalid={!!fieldState.error}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {level.map((l) => (
                              <SelectItem key={l.value} value={l.value}>
                                {l.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2 flex flex-col shrink-0">
                    <p className="text-lg pt-8">of</p>
                  </div>
                  <div className="space-y-2 flex-1/2">
                    <Label>Degree</Label>
                    <Controller
                      name={`education.${index}.degree`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Combobox
                          items={degree}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          disabled={isPending}
                        >
                          <ComboboxInput
                            placeholder="Select degree"
                            aria-invalid={!!fieldState.error}
                          />
                          <ComboboxContent className="max-h-60 overflow-y">
                            <ComboboxEmpty>No degree found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem
                                  key={item.value}
                                  value={item.value}
                                  className="cursor-pointer"
                                >
                                  {item.label}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      )}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Year</Label>
                    <Controller
                      name={`education.${index}.yearGraduated`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isPending}
                          aria-invalid={!!fieldState.error}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((y) => (
                              <SelectItem key={y.value} value={y.value}>
                                {y.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Section</Label>
                    <Controller
                      name={`education.${index}.onGoing`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Toggle
                          aria-label="Toggle large"
                          size="lg"
                          pressed={field.value}
                          onPressedChange={field.onChange}
                          aria-invalid={!!fieldState.error}
                        >
                          On Going
                        </Toggle>
                      )}
                    />
                  </div>
                  <div className="flex-col flex pt-6.5 ">
                    <Button
                      className="bg-black text-muted hover:bg-black/70"
                      size="icon-lg"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding…' : 'Add Faculty'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
