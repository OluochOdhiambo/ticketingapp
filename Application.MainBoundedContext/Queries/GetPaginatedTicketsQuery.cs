using Application.MainBoundedContextDTO.Tickets;
using Application.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContext.Queries
{
    public class GetPaginatedTicketsQuery : IQuery<PagedResult<TicketDTO>>
    {
        public int PageNumber { get; }
        public int PageSize { get; }

        public GetPaginatedTicketsQuery(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
