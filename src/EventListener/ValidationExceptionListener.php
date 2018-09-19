<?php

declare(strict_types=1);

namespace App\EventListener;

use App\Form\ErrorsFrontendNormalizer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Messenger\Exception\ValidationFailedException;

class ValidationExceptionListener implements EventSubscriberInterface
{
    /** @var ErrorsFrontendNormalizer */
    private $frontendErrorsNormalizer;

    public function __construct(ErrorsFrontendNormalizer $frontendErrorsNormalizer)
    {
        $this->frontendErrorsNormalizer = $frontendErrorsNormalizer;
    }

    public static function getSubscribedEvents(): array
    {
        return array(
            KernelEvents::EXCEPTION => array(
                ['onKernelException', 0]
            ),
        );
    }

    public function onKernelException(GetResponseForExceptionEvent $event): void
    {
        $exception = $event->getException();
        if ($exception instanceof ValidationFailedException) {
            $event->setResponse($this->handleValidationException($exception));
            $event->allowCustomResponseCode();
        }
    }

    private function handleValidationException(ValidationFailedException $e): JsonResponse
    {
        return new JsonResponse(
            [
                'success' => false,
                'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
            ],
            200,
            ['X-Status-Code' => 200]
        );
    }
}
