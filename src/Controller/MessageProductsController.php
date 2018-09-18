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
    private const QUERY_PARAM_LIMIT = 'limit';
    private const QUERY_PARAM_PAGE = 'page';

    public function listAction(Request $request, MessageBusInterface $messageBus)
    {
        $limit = $request->query->getInt(self::QUERY_PARAM_LIMIT, 5);
        $page = $request->query->getInt(self::QUERY_PARAM_PAGE, 0);
        $message = new Query\ProductList($limit, $page);

        return new JsonResponse($messageBus->dispatch($message));
    }

    public function addAction(
        Request $request,
        MessageBusInterface $messageBus,
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
            $messageBus->dispatch($command);

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

    public function deleteAction(string $id, MessageBusInterface $messageBus): Response
    {
        $messageBus->dispatch(new Command\DeleteProduct($id));

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully removed', $id)
        ]);
    }

    public function getAction(string $id, MessageBusInterface $messageBus): Response
    {
        return new JsonResponse($messageBus->dispatch(new Query\Product($id)));
    }

    public function editAction(Request $request, string $id, MessageBusInterface $messageBus): Response
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);
        if (null === $product = $repository->find($id)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(
            ProductType::class,
            $product,
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
            $messageBus->dispatch($command);

            return new JsonResponse([
                'success' => true,
                'successMessage' => sprintf('Product #%s successfully updated', $product->getId()),
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
