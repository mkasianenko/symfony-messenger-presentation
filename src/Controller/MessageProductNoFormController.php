<?php

declare(strict_types=1);

namespace App\Controller;

use App\Message\Command;
use App\Message\Query;
use Ramsey\Uuid\UuidFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Middleware\Configuration\ValidationConfiguration;

class MessageProductNoFormController extends Controller
{
    public function listAction(Request $request, MessageBusInterface $validationBus): Response
    {
        $limit = $request->query->getInt('limit', 5);
        $page = $request->query->getInt('page', 0);

        $message = new Query\ProductList($limit, $page);

        return new JsonResponse($validationBus->dispatch($message));
    }

    public function addAction(
        Request $request,
        MessageBusInterface $validationBus,
        UuidFactoryInterface $uuidFactory
    ): Response {
        $product = $request->get('Product', []);
        $id = $uuidFactory->uuid4()->toString();
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

        $validationBus->dispatch($command);

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully added', $id),
            'id' => $id
        ]);
    }

    public function deleteAction(string $id, MessageBusInterface $validationBus): Response
    {
        $validationBus->dispatch(new Command\DeleteProduct($id));

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully removed', $id)
        ]);
    }

    public function getAction(string $id, MessageBusInterface $validationBus): Response
    {
        return new JsonResponse($validationBus->dispatch(new Query\Product($id)));
    }

    public function editAction(Request $request, string $id, MessageBusInterface $validationBus): Response
    {
        $product = $request->get('Product', []);
        $command = new Envelope(
            new Command\EditProduct(
                $id,
                $product['sku'] ?? '',
                isset($product['price']) ? (float)$product['price'] : 0,
                $product['name'] ?? '',
                $product['description'] ?? null
            ),
            [new ValidationConfiguration(['edit'])]
        );

        $validationBus->dispatch($command);

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully updated', $id),
            'id' => $id
        ]);
    }
}
