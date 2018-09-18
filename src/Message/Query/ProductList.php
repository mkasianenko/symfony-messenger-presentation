<?php

declare(strict_types=1);

namespace App\Message\Query;

class ProductList
{
    /** @var int */
    private $limit;

    /** @var int */
    private $page;

    public function __construct(int $limit, int $page)
    {
        $this->limit = $limit;
        $this->page = $page;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getPage(): int
    {
        return $this->page;
    }
}
