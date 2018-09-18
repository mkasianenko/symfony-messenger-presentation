<?php

declare(strict_types=1);

namespace App\Message\QueryHandler;

use App\Entity\Product;
use App\Message\AbstractHandler\AbstractProductHandler;
use App\Message\Query\ProductList;

class ProductListHandler extends AbstractProductHandler
{
    /**
     * @param ProductList $message
     *
     * @return Product[]
     */
    public function __invoke(ProductList $message): array
    {
        $repository = $this->getProductRepository();

        return $repository->findBy([], ['sku' => 'ASC'], $message->getLimit(), $message->getPage());
    }
}
