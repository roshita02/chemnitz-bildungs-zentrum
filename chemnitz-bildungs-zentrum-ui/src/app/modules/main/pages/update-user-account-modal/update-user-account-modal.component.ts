import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../services/main.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { plainToClass } from 'class-transformer';
import { User } from '../../../../shared/model/user.model';
import { first, takeUntil } from 'rxjs';

@Component({
  selector: 'app-update-user-account-modal',
  templateUrl: './update-user-account-modal.component.html',
  styleUrl: './update-user-account-modal.component.scss'
})
export class UpdateUserAccountModalComponent extends subscribedContainerMixin() implements OnInit {
  editProfileForm: FormGroup;
  currentUser!: User;
  currentUserId!: string;
  editingProfile!: boolean;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private mainService: MainService,
    private modal: NzModalRef
  ) {
    super();
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
      this.currentUserId = this.currentUser._id || '';
      this.editProfileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      });
    }
  }

  editProfile(): void {
    // tslint:disable-next-line: forin
    for (const key in this.editProfileForm.controls) {
      this.editProfileForm.controls[key].markAsDirty();
      this.editProfileForm.controls[key].updateValueAndValidity();
    }

    if(this.editProfileForm.valid) {
      this.editingProfile = true;
      this.mainService.updateUser(this.currentUserId, this.editProfileForm.value).pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.editingProfile = false;
        if (res.success) {
          let user = JSON.stringify(res.data);
          localStorage.setItem('currentUser', user);
          this.currentUser = plainToClass(User, user);
          this.modal.close({
            success: true,
            message: 'Profile updated successfully.',
            data: this.currentUser
          });
        } else {
          this.modal.close({
            success: false,
            message:
              res.message ?? `Unable to update profile information.`,
          });
        }
      },
      (err) => {
        this.editingProfile = false;
        this.errorMessage = err.error.message.toString();
        // tslint:disable-next-line: forin
        for (const key in err.error.errors) {
          if (key === 'email') {
            this.editProfileForm.controls['email'].setErrors({
              emailNotUnique: true // custom = server side valdiation
            });
          }
        }
      }
    )}
  }

  cancel(): void {
    this.modal.close();
  }

}
