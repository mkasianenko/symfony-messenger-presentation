<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\FormInterface;
use Symfony\Component\Messenger\Exception\ValidationFailedException;
use Symfony\Component\Validator\ConstraintViolationInterface;

class ErrorsFrontendNormalizer
{
    public function normalizeByForm(FormInterface $form): array
    {
        $frontendErrors = [];
        $formErrors = $form->getErrors(true, true);
        foreach ($formErrors as $formError) {
            $propertyPath = $formError->getCause()->getPropertyPath();
            $propName = str_replace('data.', '', $propertyPath);
            if (false === \array_key_exists($propName, $frontendErrors)) {
                $frontendErrors[$propName] = [];
            }
            $frontendErrors[$propName][] = $formError->getMessage();
        }

        return $frontendErrors;
    }

    public function normalizeByValidationException(ValidationFailedException $e): array
    {
        $frontendErrors = [];
        /** @var ConstraintViolationInterface $violation */
        foreach ($e->getViolations() as $violation) {
            $propName = $violation->getPropertyPath();
            if (false === \array_key_exists($propName, $frontendErrors)) {
                $frontendErrors[$propName] = [];
            }
            $frontendErrors[$propName][] = $violation->getMessage();
        }

        return $frontendErrors;
    }
}
