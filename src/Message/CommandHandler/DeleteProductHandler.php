<?php

declare(strict_types=1);

namespace App\Message\CommandHandler;

use App\Message\AbstractHandler\AbstractProductHandler;
use App\Message\Command\DeleteProduct;

class DeleteProductHandler extends AbstractProductHandler
{
    public function __invoke(DeleteProduct $message): void
    {
        if (null !== $product = $this->getProductRepository()->find($message->getId())) {
            $productManager = $this->getProductManager();
            $productManager->remove($product);
            $productManager->flush();
        }
    }
}
