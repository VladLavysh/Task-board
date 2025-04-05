import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchesPassword', async: false })
export class MatchesPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    return obj.password === value;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}
