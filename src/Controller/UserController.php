<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Typical Web ui approach for crud CRUD
 */
class UserController extends Controller
{
    public function listAction(): JsonResponse
    {
        $repository = $this->getDoctrine()->getRepository(User::class);

        $users = $repository->findBy([], ['id' => 'ASC'], 10, 0);
        $usersArray = \array_map(
            function(User $user) {
                return [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'password' => $user->getPassword()
                ];
            },
            $users
        );

        return new JsonResponse($usersArray);
    }

    public function addAction(Request $request): Response
    {
        $form = $this->createForm(UserType::class);
        $formErrorMessages = [];

        if ($form->handleRequest($request)->isSubmitted() && $form->isValid()) {
            /** @var User $user */
            $user = $form->getData();

            $repository = $this->getDoctrine()->getRepository(User::class);
            if (null === $repository->findOneBy(['email' => $user->getEmail()])) {
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();

                return new JsonResponse(['success' => true]);
            }

            $formErrorMessages['email'] = [
                sprintf('%s email is already used', $user->getEmail())
            ];
        }

        $formErrors = $form->getErrors(true, true);

        foreach ($formErrors as $formError) {
            $propertyPath = $formError->getCause()->getPropertyPath();
            $propName = str_replace('data.', '', $propertyPath);
            if (false === \array_key_exists($propName, $formErrorMessages)) {
                $formErrorMessages[$propName] = [];
            }
            $formErrorMessages[$propName][] = $formError->getMessage();
        }

        return new JsonResponse(
            [
                'success' => false,
                'errors' => $formErrorMessages
            ]
        );
    }

    public function deleteAction(int $id): Response
    {
        $repository = $this->getDoctrine()->getRepository(User::class);
        if (null === $user = $repository->find($id)) {
            return new Response('', Response::HTTP_NOT_FOUND);
        }

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($user);
        $entityManager->flush();

        return new Response();
    }
}
