import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from '../../../../shared/model/user.model';
import { takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { UserService } from '../../../main/shared/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent extends subscribedContainerMixin() implements OnInit {
  signInForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private notification: NzNotificationService) {
                super();
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
    this.errorMessage = '';
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.signInForm.controls) {
        this.signInForm.controls[i].markAsDirty();
        this.signInForm.controls[i].updateValueAndValidity();
    }

    this.isLoading = true;
    if (this.signInForm.valid){
      this.authService.userSignIn(
        this.signInForm.value.email,
        this.signInForm.value.password
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
          if (res.success) {
            let user = plainToClass(User, res.data);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.userService.setUser(user);
              if (res.token) {
                localStorage.setItem('authToken', res.token);
              }
              this.notification.create(
                'success',
                'Sign In Successful',
                'You have been successfully signed in.',
                { nzPlacement: 'bottomLeft' }
              );
             
              this.redirectUrl();
              this.isLoading = false;
          } else if (!res.success  && res.message){
            this.errorMessage = res.message;
            this.isLoading = false;
          }
        },
          err => {
            if (err.error.message) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Something went wrong please try again.';
            }
            this.isLoading = false;
        });
    }else{
      this.isLoading = false;
    }
  }

  redirectUrl(): void{
    this.router.navigate(['/']);
  }
}
