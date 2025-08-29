import { Component, inject } from '@angular/core';
import { Pin } from '../../../services/pin';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavHeader } from "../../nav-header/nav-header";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-pin',
  imports: [ReactiveFormsModule, NavHeader],
  templateUrl: './create-pin.html',
  styleUrl: './create-pin.css'
})
export class CreatePin {
private pin = inject(Pin)
private route = inject(Router)

createForm : FormGroup = new FormGroup({
  media: new FormControl<File | null>(null, { validators: [Validators.required] }),
  title: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
  description: new FormControl('', { validators: [Validators.maxLength(500), Validators.required] }),
  link: new FormControl('', { validators: [Validators.maxLength(200)] }),
  keywords: new FormControl('', { validators: [Validators.maxLength(200)] }),
  privacy: new FormControl('public', { validators: [Validators.required] })
})
  previewUrl: string | null = null; 
  loading = false;
   errorMsg = '';
  successMsg = '';

  onSubmit(){
  this.loading = true;
  const payload={
    media: this.createForm.value.media as File,
    title: this.createForm.value.title as string,
    description: this.createForm.value.description as string,
    link: this.createForm.value.link as string,
    keywords: this.createForm.value.keywords as string,
    privacy: 'public' as 'public'
  }

  this.pin.createPin(payload).subscribe({
    next: (response) => {
      this.loading = false;
      this.successMsg = 'Pin created successfully!';
      
      console.log('Pin created successfully:', response);
    },
    error: (error) => {
      this.loading = false;
      this.errorMsg = 'Error creating pin.';
      console.error('Error creating pin:', error);
    }
  });
}
  
  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) return;

    if (!/^image|video\//.test(file.type)) {
      alert('Only images or videos are allowed.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert('File is too large.');
      return;
    }

    this.createForm.patchValue({ media: file });
    this.createForm.get('media')?.markAsDirty();

    if (file.type.startsWith('image/')) {
      this.previewUrl && URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = URL.createObjectURL(file);
    } else {
      this.previewUrl = null;
    }
  }


dragOver = false;

onDragOver(e: DragEvent) {
  e.preventDefault();
  this.dragOver = true;
}
onDragLeave(_e: DragEvent) {
  this.dragOver = false;
}
onDrop(e: DragEvent) {
  e.preventDefault();
  this.dragOver = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) this.handleFile(file);
}
private handleFile(file: File) {
  if (!/^image|video\//.test(file.type)) return alert('Only images or videos are allowed.');
  if (file.size > 200 * 1024 * 1024) return alert('File too large.');

  this.createForm.patchValue({ media: file });
  this.createForm.get('media')?.markAsDirty();

  if (file.type.startsWith('image/')) {
    this.previewUrl && URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);
  } else {
    this.previewUrl = null;
  }
}
}