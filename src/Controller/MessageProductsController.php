<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Product;
use App\Form\ErrorsFrontendNormalizer;
use App\Form\ProductType;
use App\Message\Command;
use App\Message\Query;
use Ramsey\Uuid\UuidFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;

class MessageProductsController extends Controller
{
    public function listAction(Request $request, MessageBusInterface $defaultBus): Response
    {
        $limit = $request->query->getInt('limit', 5);
        $page = $request->query->getInt('page', 0);

        $message = new Query\ProductList($limit, $page);

        return new JsonResponse($defaultBus->dispatch($message));
    }

    public function addAction(
        Request $request,
        MessageBusInterface $defaultBus,
        UuidFactoryInterface $uuidFactory
    ): Response {
        $form = $this->createForm(
            ProductType::class,
            null,
            ['method' => Request::METHOD_POST, 'validation_groups' => ['create']]
        );
        if ($form->handleRequest($request)->isSubmitted() && $form->isValid()) {
            $id = $uuidFactory->uuid4()->toString();
            /** @var Product $product */
            $product = $form->getData();
            $command = new Command\AddProduct(
                $id,
                $product->getSku(),
                $product->getPrice(),
                $product->getName(),
                $product->getDescription()
            );
            $defaultBus->dispatch($command);

            return new JsonResponse([
                'success' => true,
                'successMessage' => sprintf('Product #%s successfully added', $id),
                'id' => $id
            ]);
        }

        /** @var ErrorsFrontendNormalizer $frontendErrorsNormalizer */
        $frontendErrorsNormalizer = $this->container->get(ErrorsFrontendNormalizer::class);
        $errors = $frontendErrorsNormalizer->normalizeByForm($form);

        return new JsonResponse(
            [
                'success' => false,
                'errors' => $errors
            ]
        );
    }

    public function deleteAction(string $id, MessageBusInterface $defaultBus): Response
    {
        $defaultBus->dispatch(new Command\DeleteProduct($id));

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully removed', $id)
        ]);
    }

    public function getAction(string $id, MessageBusInterface $defaultBus): Response
    {
        if (null === $product = $defaultBus->dispatch(new Query\Product($id))) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($product);
    }

    public function editAction(Request $request, string $id, MessageBusInterface $defaultBus): Response
    {
        $form = $this->createForm(
            ProductType::class,
            null,
            ['method' => Request::METHOD_PUT, 'validation_groups' => ['edit']]
        );
        if ($form->handleRequest($request)->isSubmitted() && $form->isValid()) {
            /** @var Product $product */
            $product = $form->getData();
            $command = new Command\EditProduct(
                $id,
                $product->getSku(),
                $product->getPrice(),
                $product->getName(),
                $product->getDescription()
            );
            $defaultBus->dispatch($command);

            return new JsonResponse([
                'success' => true,
                'successMessage' => sprintf('Product #%s successfully updated', $id),
                'id' => $id
            ]);
        }

        /** @var ErrorsFrontendNormalizer $frontendErrorsNormalizer */
        $frontendErrorsNormalizer = $this->container->get(ErrorsFrontendNormalizer::class);
        $errors = $frontendErrorsNormalizer->normalizeByForm($form);

        return new JsonResponse(
            [
                'success' => false,
                'errors' => $errors
            ]
        );
    }
}
