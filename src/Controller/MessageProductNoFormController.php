<?php

declare(strict_types=1);

namespace App\Controller;

use App\Form\ErrorsFrontendNormalizer;
use Ramsey\Uuid\UuidFactoryInterface;
use App\Message\Command;
use App\Message\Query;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Exception\ValidationFailedException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Middleware\Configuration\ValidationConfiguration;

class MessageProductNoFormController extends Controller
{
    private const QUERY_PARAM_LIMIT = 'limit';
    private const QUERY_PARAM_PAGE = 'page';

    /** @var MessageBusInterface */
    private $messageBusWithValidation;

    /** @var UuidFactoryInterface */
    private $uuidFactory;

    /** @var ErrorsFrontendNormalizer */
    private $frontendErrorsNormalizer;

    public function __construct(
        MessageBusInterface $messageBus,
        UuidFactoryInterface $uuidFactory,
        ErrorsFrontendNormalizer $frontendErrorsNormalizer
    ) {
        $this->messageBusWithValidation = $messageBus;
        $this->uuidFactory = $uuidFactory;
        $this->frontendErrorsNormalizer = $frontendErrorsNormalizer;
    }

    public function listAction(Request $request): Response
    {
        $limit = $request->query->getInt(self::QUERY_PARAM_LIMIT, 5);
        $page = $request->query->getInt(self::QUERY_PARAM_PAGE, 0);

        $message = new Query\ProductList($limit, $page);
        try {
            return new JsonResponse($this->messageBusWithValidation->dispatch($message));
        } catch (ValidationFailedException $e) {
            return new JsonResponse(
                [
                    'success' => false,
                    'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
                ]
            );
        }
    }

    public function addAction(Request $request): Response {
        $product = $request->get('Product', []);
        $id = $this->uuidFactory->uuid4()->toString();
        $command = new Envelope(
            new Command\AddProduct(
                $id,
                $product['sku'] ?? '',
                isset($product['price']) ? (float)$product['price'] : 0,
                $product['name'] ?? '',
                $product['name'] ?? null
            ),
            [new ValidationConfiguration(['create'])]
        );
        try {
            $this->messageBusWithValidation->dispatch($command);
        } catch (ValidationFailedException $e) {
            return new JsonResponse(
                [
                    'success' => false,
                    'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
                ]
            );
        }

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully added', $id),
            'id' => $id
        ]);
    }

    public function deleteAction(string $id): Response
    {
        try {
            $this->messageBusWithValidation->dispatch(new Command\DeleteProduct($id));
        } catch (ValidationFailedException $e) {
            return new JsonResponse(
                [
                    'success' => false,
                    'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
                ]
            );
        }

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully removed', $id)
        ]);
    }

    public function getAction(string $id): Response
    {
        try {
            $product = $this->messageBusWithValidation->dispatch(new Query\Product($id));

            return new JsonResponse($product);
        } catch (ValidationFailedException $e) {
            return new JsonResponse(
                [
                    'success' => false,
                    'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
                ]
            );
        }
    }

    public function editAction(Request $request, string $id): Response
    {
        $product = $request->get('Product', []);
        $command = new Envelope(
            new Command\EditProduct(
                $id,
                $product['sku'] ?? '',
                isset($product['price']) ? (float)$product['price'] : 0,
                $product['name'] ?? '',
                $product['name'] ?? null
            ),
            [new ValidationConfiguration(['edit'])]
        );
        try {
            $this->messageBusWithValidation->dispatch($command);
        } catch (ValidationFailedException $e) {
            return new JsonResponse(
                [
                    'success' => false,
                    'errors' => $this->frontendErrorsNormalizer->normalizeByValidationException($e)
                ]
            );
        }

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully updated', $id),
            'id' => $id
        ]);
    }
}
