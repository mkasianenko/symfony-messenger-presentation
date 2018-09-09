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
    private const QUERY_PARAM_LIMIT = 'limit';
    private const QUERY_PARAM_PAGE = 'page';

    public function listAction(Request $request): JsonResponse
    {
        $repository = $this->getDoctrine()->getRepository(Product::class);

        $limit = $request->query->getInt(self::QUERY_PARAM_LIMIT, 5);
        $page = $request->query->getInt(self::QUERY_PARAM_PAGE, 0);

        $products = $repository->findBy([], ['sku' => 'ASC'], $limit, $page);

        return new JsonResponse($products);
    }

    public function addAction(Request $request): Response
    {
        $form = $this->createForm(ProductType::class);
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
                'successMessage' => sprintf(
                    'Product with sku #%s and id #%s successfully added',
                    $product->getSku(),
                    $product->getId()
                ),
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
            'successMessage' => sprintf(
                'Product with sku #%s and id #%s successfully removed',
                $product->getSku(),
                $product->getId()
            )
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
}
