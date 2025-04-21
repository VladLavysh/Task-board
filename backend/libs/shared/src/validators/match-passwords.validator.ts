import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchesPassword', async: false })
@Injectable()
export class MatchesPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

// Decorator for easy use in DTOs
export function Match(property: string, validationOptions?: any) {
  return function (object: any, propertyName: string) {
    object.__proto__.constructor.prototype.constructor._MATCH_VALIDATION = {
      [propertyName]: { property, validationOptions },
    };
  };
}
