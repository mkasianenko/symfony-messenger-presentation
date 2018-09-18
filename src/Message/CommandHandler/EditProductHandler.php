<?php

declare(strict_types=1);

namespace App\Message\CommandHandler;

use App\Entity\Product;
use App\Message\AbstractHandler\AbstractProductHandler;
use App\Message\Command\EditProduct;

class EditProductHandler extends AbstractProductHandler
{
    public function __invoke(EditProduct $message): void
    {
        /** @var Product $product */
        if (null !== $product = $this->getProductRepository()->find($message->getId())) {
            $product
                ->setSku($message->getSku())
                ->setPrice($message->getPrice())
                ->setName($message->getName())
                ->setDescription($message->getDescription());

            $productManager = $this->getProductManager();
            $productManager->persist($product);
            $productManager->flush();
        }
    }
}
