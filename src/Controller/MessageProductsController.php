<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Product;
use App\Form\ErrorsFrontendNormalizer;
use App\Form\ProductType;
use App\Message\Command\AddProduct;
use Ramsey\Uuid\UuidFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Messenger\MessageBusInterface;

class MessageProductsController extends Controller
{
    public function listAction(Request $request)
    {
    }

    public function addAction(
        Request $request,
        MessageBusInterface $messageBus,
        UuidFactoryInterface $uuidFactory
    ) {
        $form = $this->createForm(
            ProductType::class,
            null,
            ['method' => Request::METHOD_POST, 'validation_groups' => ['create']]
        );
        if ($form->handleRequest($request)->isSubmitted() && $form->isValid()) {
            $id = $uuidFactory->uuid4()->toString();
            /** @var Product $product */
            $product = $form->getData();
            $command = AddProduct::fromProduct($product->setId($id));
            $messageBus->dispatch($command);

            return new JsonResponse([
                'success' => true,
                'successMessage' => sprintf('Product #%s successfully added', $product->getId()),
                'id' => $product->getId()
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

    public function deleteAction(string $id)
    {
    }

    public function getAction(string $id)
    {
    }

    public function editAction(Request $request, string $id)
    {
    }
}
