<?php

declare(strict_types=1);

namespace App\Message\CommandHandler;

use App\Entity\Product;
use App\Message\AbstractHandler\AbstractProductHandler;
use App\Message\Command\AddProduct;

class AddProductHandler extends AbstractProductHandler
{
    public function __invoke(AddProduct $message): void
    {
        $product = (new Product())
            ->setId($message->getId())
            ->setSku($message->getSku())
            ->setPrice($message->getPrice())
            ->setName($message->getName())
            ->setDescription($message->getDescription());

        $productManager = $this->getProductManager();
        $productManager->persist($product);
        $productManager->flush();
    }
}
