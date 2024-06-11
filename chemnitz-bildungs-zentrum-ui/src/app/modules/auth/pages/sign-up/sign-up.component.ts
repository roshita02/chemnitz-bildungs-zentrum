import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ConfirmPasswordValidator } from '../../validator/confirm-password.validator';
import { RegisterUserRequest } from '../../model/register-user-request.model';
import { takeUntil } from 'rxjs';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { User } from '../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent extends subscribedContainerMixin() implements OnInit {
  signUpForm!: FormGroup;
  errorMessage!: string;
  email!: string;
  isLoading = false;
  successMessage!: string;

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notification: NzNotificationService) {
                super();
  }
  ngOnInit(): void {
    let emailValidations = [Validators.email, Validators.required];
    this.signUpForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName:  [null, [Validators.required]],
      email: [null, emailValidations],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
    },
      {
        validator: ConfirmPasswordValidator.passwordMatchValidator,
      }
    );
  }

  checkForButtonDisabled(): boolean {
    return !(this.signUpForm.valid);
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }

    if (this.signUpForm.valid) {
      this.isLoading = true;
      const data: RegisterUserRequest = {
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };
      this.auth.userRegister(data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          const userInfo = plainToClass(User, res.data);
          this.email = this.signUpForm.value.email;
          this.successMessage = 'Welcome, your account has been activated. You can proceed to log in.';
        } else {
          this.errorMessage = res.message || '';
        }
        this.isLoading = false;
      }, err => {
          this.errorMessage = err.error.message.toString();
          this.isLoading = false;
      });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/auth/sign-in']);
  }
}
