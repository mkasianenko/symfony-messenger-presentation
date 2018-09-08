<?php

declare(strict_types=1);

namespace App\Form;

use Symfony\Component\Form\FormInterface;

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
}
