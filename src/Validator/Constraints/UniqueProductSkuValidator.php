<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use App\Entity\Product;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class UniqueProductSkuValidator extends ConstraintValidator
{
    /** @var ManagerRegistry */
    private $doctrine;

    /**
     * UniqueUserEmailValidator constructor.
     * @param ManagerRegistry $doctrine
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Checks if the passed value is valid.
     *
     * @param mixed $value The value that should be validated
     * @param Constraint $constraint The constraint for the validation
     */
    public function validate($value, Constraint $constraint): void
    {
        // constraint should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) take care of that
        if (null === $value || '' === $value) {
            return;
        }

        $repository = $this->doctrine->getRepository(Product::class);
        if (null !== $repository->findOneBy(['sku' => $value])) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ sku }}', $value)
                ->addViolation()
            ;
        }
    }
}
