<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Product;
use App\Form\ErrorsFrontendNormalizer;
use App\Form\ProductType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Typical Web ui approach for crud CRUD
 */
class ProductsController extends Controller
{
    public function listAction(Request $request): JsonResponse
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);

        $limit = $request->query->getInt('limit', 5);
        $page = $request->query->getInt('page', 0);

        $products = $repository->findBy([], ['sku' => 'ASC'], $limit, $page);

        return new JsonResponse($products);
    }

    public function addAction(Request $request): Response
    {
        $form = $this->createForm(
            ProductType::class,
            null,
            ['method' => Request::METHOD_POST, 'validation_groups' => ['create']]
        );
        if ($form->handleRequest($request)->isSubmitted() && $form->isValid()) {
            /** @var Product $product */
            $product = $form->getData();
            if (null === $entityManager = $this->getDoctrine()->getManagerForClass(Product::class)) {
                throw new \LogicException(sprintf('Manager for class %s not found', Product::class));
            }

            $entityManager->persist($product);
            $entityManager->flush();

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

    public function deleteAction(string $id): Response
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);
        if (null === $product = $repository->find($id)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($product);
        $entityManager->flush();

        return new JsonResponse([
            'success' => true,
            'successMessage' => sprintf('Product #%s successfully removed', $id)
        ]);
    }

    public function getAction(string $id): Response
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);
        if (null === $product = $repository->find($id)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($product);
    }

    public function editAction(Request $request, string $id): Response
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
            if (null === $entityManager = $this->getDoctrine()->getManagerForClass(Product::class)) {
                throw new \LogicException(sprintf('Manager for class %s not found', Product::class));
            }

            $product->setId($id);
            $entityManager->persist($product);
            $entityManager->flush();

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
