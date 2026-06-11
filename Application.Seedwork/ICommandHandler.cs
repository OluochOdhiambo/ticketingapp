using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Seedwork
{
    public interface ICommandHandler<TCommand>
    where TCommand : ICommand
    {
        Task HandleAsync(TCommand command, CancellationToken cancellationToken);
    }

    public interface ICommandHandler<TCommand, TResult>
        where TCommand : ICommand<TResult>
    {
        Task<TResult> HandleAsync(
            TCommand command,
            CancellationToken cancellationToken);
    }
}
