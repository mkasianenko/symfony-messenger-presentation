<?php

declare(strict_types=1);

namespace App\Message\QueryHandler;

use App\Entity\Product as ProductEntity;
use App\Message\AbstractHandler\AbstractProductHandler;
use App\Message\Query\Product;

class ProductHandler extends AbstractProductHandler
{
    public function __invoke(Product $message): ?ProductEntity
    {
        return $this->getProductRepository()->find($message->getId());
    }
}
