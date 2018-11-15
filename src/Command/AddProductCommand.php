<?php

declare(strict_types=1);

namespace App\Command;

use App\Message\Command;
use Ramsey\Uuid\UuidFactoryInterface;
use Symfony\Component\Console\Command\Command as ConsoleCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Exception\ValidationFailedException;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Middleware\Configuration\ValidationConfiguration;

class AddProductCommand extends ConsoleCommand
{
    public const NAME = 'app:add-product';

    public const OPTION_SKU = 'sku';
    public const OPTION_PRICE = 'price';
    public const OPTION_NAME = 'name';
    public const OPTION_DESCRIPTION = 'description';

    /** @var MessageBusInterface */
    private $validationBus;

    /** @var UuidFactoryInterface */
    private $uuidFactory;

    public function __construct(
        MessageBusInterface $validationBus,
        UuidFactoryInterface $uuidFactory
    ) {
        $this->validationBus = $validationBus;
        $this->uuidFactory = $uuidFactory;

        parent::__construct(self::NAME);
    }

    public function configure()
    {
        $this
            ->setDescription('Add new product')
            ->addOption(self::OPTION_SKU, 's', InputOption::VALUE_REQUIRED)
            ->addOption(self::OPTION_PRICE, 'p', InputOption::VALUE_REQUIRED)
            ->addOption(self::OPTION_NAME, 'pn', InputOption::VALUE_REQUIRED)
            ->addOption(self::OPTION_DESCRIPTION, 'd', InputOption::VALUE_OPTIONAL)
        ;
    }

    public function execute(InputInterface $input, OutputInterface $output)
    {
        $id = $this->uuidFactory->uuid4()->toString();
        $command = new Envelope(
            new Command\AddProduct(
                $id,
                $input->getOption(self::OPTION_SKU),
                (float)$input->getOption(self::OPTION_PRICE),
                $input->getOption(self::OPTION_NAME),
                $input->getOption(self::OPTION_DESCRIPTION)
            ),
            [new ValidationConfiguration(['create'])]
        );
        try {
            $this->validationBus->dispatch($command);

            $output->writeln(sprintf('Product #%s successfully added', $id));
        } catch (ValidationFailedException $e) {
            $output->writeln($e);
        }
    }
}
