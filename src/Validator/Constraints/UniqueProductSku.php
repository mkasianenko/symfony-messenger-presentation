<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

class UniqueProductSku extends Constraint
{
    public $message = 'product with sku#"{{ sku }}" already exists';
}
